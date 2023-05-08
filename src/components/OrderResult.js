import React from "react";
import {useLocation} from "react-router";
import $ from "jquery";
import axios from "axios";
import {Redirect} from "react-router-dom";

function OrderResult() {
    const location = useLocation();
    const payResult = location.search ? JSON.parse(decodeURIComponent(location.search.substring(1))) : location.state && location.state.payResult ? location.state.payResult : null;

    // 받아오는 데이터가 없을 경우 '/'로 리다이렉트
    if (!payResult) {
        return (
            <div>
                <Redirect to="/"/>
            </div>
        );
    }

    /*
     * 결제승인요청 파라미터 세팅 ('결제승인요청' 버튼 클릭시 호출)
     */
    const handlePayConfirm = (e) => {
        e.preventDefault();
        console.log('payResult Value', payResult);
        if (window.confirm('결제 승인하겠습니까?')) {
            const serializeArray = $('#payConfirm').serializeArray();
            let reqData = {};

            // #payConfirm내 form에 입력된 값을 객체(reqData)에 추가
            serializeArray.forEach(element => {
                reqData[element['name']] = element['value'];
            });
            console.log('결제 요청 데이터', reqData);

            // 토큰값 세팅
            const payConfirmURL = payResult.PCD_PAY_COFURL;               // 결제승인요청 URL
            const params = {
                PCD_CST_ID: process.env.REACT_APP_CST_ID,                // 가맹점 ID (실결제시 .env 파일내 발급받은 운영ID를 작성하시기 바랍니다.)
                PCD_CUST_KEY: process.env.REACT_APP_CUST_KEY,            // 가맹점 Key (실결제시 .env 파일내 발급받은 운영Key를 작성하시기 바랍니다.)
                PCD_AUTH_KEY: payResult.PCD_AUTH_KEY,                     // 결제용 인증키
                PCD_PAY_TYPE: payResult.PCD_PAY_TYPE,                     // 결제방법
                PCD_PAYER_ID: payResult.PCD_PAYER_ID,                     // 결제자 고유ID
                PCD_PAY_REQKEY: payResult.PCD_PAY_REQKEY                  // 결제요청 고유KEY
            }

            // 결제승인요청 URL로 결제승인요청
            axios.post(payConfirmURL, JSON.stringify(params), {
                header: {
                    'content-type': 'application/json',
                    'referer': process.env.REACT_APP_HOSTNAME      //API 서버를 따로 두고 있는 경우, Referer 에 가맹점의 도메인 고정
                }
            }).then(res => {
                console.log(res.data)
                if (res.data.PCD_PAY_MSG) {
                    var $_table = $("<table></table>");
                    var table_data = "";

                    $_table.append('<p><strong>결제 요청 메시지</strong></p>')

                    $.each(res.data, function (key, value) {
                        table_data += '<tr><td>' + key + '</td><td>: ' + value + '</td><tr>';
                    });

                    $_table.append(table_data);

                    $_table.appendTo('#payConfirmResult');

                    $('#payConfirmResult').css('display', '');

                    if (res.data.PCD_PAY_RST === 'success') {
                        $('#payConfirmAction').css('display', 'none');
                        $('#payConfirmCancel').css('display', '');
                    } else {
                        window.alert(res.data.PCD_PAY_MSG);
                    }
                } else {
                    window.alert('결제요청실패');
                    return false;
                }
            }).catch((err) => {
                console.error(err);
                window.alert(err);
            })
        }

    }

    /*
     * 환불(승인취소) 파라미터 세팅 ('결제승인취소' 버튼 클릭시 호출)
     * ref: https://developer.payple.kr/etc-api/cancel-payment
     */
    const handlePayRefund = (e) => {
        e.preventDefault();
        if (window.confirm('환불(승인취소)요청을 전송합니다. \n진행하시겠습니까?')) {
            axios.post('/api/auth',{PCD_PAYCANCEL_FLAG: 'Y'}).then((res) => {
                // 토큰값 세팅
                const refundURL = res.data.return_url;                                // 리턴 받은 환불(승인취소) URL
                const params = {
                    PCD_CST_ID: res.data.cst_id,                                      // 리턴 받은 cst_id Token
                    PCD_CUST_KEY: res.data.custKey,                                   // 리턴 받은 custKey Token
                    PCD_AUTH_KEY: res.data.AuthKey,                                   // 결제용 인증키
                    PCD_REFUND_KEY: process.env.REACT_APP_PCD_REFUND_KEY,            // 환불서비스 Key (관리자페이지 상점정보 > 기본정보에서 확인하실 수 있습니다.)
                    PCD_PAYCANCEL_FLAG: "Y",                                          // 'Y' – 고정 값
                    PCD_PAY_OID: payResult.PCD_PAY_OID,                               // 주문번호
                    PCD_PAY_DATE: payResult.PCD_PAY_TIME.substring(0, 8),             // 취소할 원거래일자
                    PCD_REFUND_TOTAL: payResult.PCD_REFUND_TOTAL,                     // 환불 요청금액 (기존 결제금액보다 적은 금액 입력 시 부분취소로 진행)
                    PCD_REGULER_FLAG: payResult.PCD_REGULER_FLAG,                     // 월 중복결제 방지 Y(사용) | N(그 외)
                    PCD_PAY_YEAR: payResult.PCD_PAY_YEAR,                             // 결제 구분 년도
                    PCD_PAY_MONTH: payResult.PCD_PAY_MONTH,                           // 결제 구분 월
                }

                axios.post(refundURL, JSON.stringify(params), {
                    header: {
                        'content-type': 'application/json',
                        'referer': process.env.REACT_APP_HOSTNAME           //API 서버를 따로 두고 있는 경우, Referer 에 가맹점의 도메인 고정
                    }
                }).then(res => {
                    if (res.data.PCD_PAY_MSG) {
                        var $_table = $("<table></table>");
                        var table_data = "";

                        $_table.append('<p><strong>환불(승인취소) 메시지</strong></p>')

                        $.each(res.data, function (key, value) {
                            table_data += '<tr><td>' + key + '</td><td>: ' + value + '</td><tr>';
                        });

                        $_table.append(table_data);

                        $_table.appendTo('#payConfirmResult');

                        $('#payConfirmResult').css('display', '');

                        if (res.data.PCD_PAY_RST === 'success') {
                            $('#payConfirmCancel').css('display', 'none');
                            window.alert('환불(승인취소)요청 성공');
                        } else {
                            window.alert(res.data.PCD_PAY_MSG);
                        }
                    } else {
                        window.alert('환불(승인취소)요청 실패');
                        return false;
                    }
                });
            }).catch((err) => {
                console.error(err);
                window.alert(err);
            })
        }
        if (payResult.PCD_PAY_TYPE === 'PAY') $('#payConfirmCancel').css('display', '');
    }

    return (
        <div>
            <div style={{border: "1px solid black", width: "800px"}}>
                PCD_PAY_RST = {payResult.PCD_PAY_RST} {/* 결제요청 결과(success|error) */}
                <br/>
                PCD_PAY_MSG = {payResult.PCD_PAY_MSG} {/* 결제요청 결과 메시지 */}
                <br/>
                PCD_PAY_OID = {payResult.PCD_PAY_OID} {/* 주문번호 */}
                <br/>
                PCD_PAY_TYPE = {payResult.PCD_PAY_TYPE} {/* 결제 방법 (transfer | card) */}
                <br/>
                PCD_PAY_WORK = {payResult.PCD_PAY_WORK} {/* 결제요청 업무구분 (CERT: 결제정보인증등록, PAY: 결제승인요청 ) */}
                <br/>
                PCD_PAYER_ID = {payResult.PCD_PAYER_ID} {/* 결제자 고유ID (결제완료시 RETURN) */}
                <br/>
                PCD_PAYER_NO = {payResult.PCD_PAYER_NO} {/* 가맹점 회원 고유번호 */}
                <br/>
                {(() => {
                    if (payResult.PCD_PAY_TYPE === 'transfer') {
                        return (<div>
                            PCD_PAY_BANKACCTYPE
                            = {payResult.PCD_PAY_BANKACCTYPE} {/*현금영수증 발행대상 (개인:personal, 사업자:company)*/}
                        </div>)
                    }
                })()}
                PCD_PAYER_NAME = {payResult.PCD_PAYER_NAME} {/* 결제자 이름 */}
                <br/>
                PCD_PAYER_EMAIL = {payResult.PCD_PAYER_EMAIL} {/* 결제자 Email (출금결과 수신) */}
                <br/>
                PCD_REGULER_FLAG = {payResult.PCD_REGULER_FLAG} {/* 정기결제 (Y|N) */}
                <br/>
                PCD_PAY_YEAR = {payResult.PCD_PAY_YEAR} {/* 정기결제 구분 년도 */}
                <br/>
                PCD_PAY_MONTH = {payResult.PCD_PAY_MONTH} {/* 정기결제 구분 월 */}
                <br/>
                PCD_PAY_GOODS = {payResult.PCD_PAY_GOODS} {/* 결제 상품 */}
                <br/>
                PCD_PAY_TOTAL = {payResult.PCD_PAY_TOTAL} {/* 결제 금액*/}
                {(() => {
                    if (payResult.PCD_PAY_TYPE === 'card') {
                        return (<div>
                                PCD_PAY_TAXTOTAL = {payResult.PCD_PAY_TAXTOTAL} {/* 부가세 (복합과세 경우) */}
                                <br/>
                                PCD_PAY_ISTAX = {payResult.PCD_PAY_ISTAX} {/* 과세여부 (과세:Y 비과세(면세):N) */}
                                <br/>
                                PCD_PAY_CARDNAME = {payResult.PCD_PAY_CARDNAME} {/* 카드사명 */}
                                <br/>
                                PCD_PAY_CARDNUM = {payResult.PCD_PAY_CARDNUM} {/* 카드번호 */}
                                <br/>
                                PCD_PAY_CARDTRADENUM = {payResult.PCD_PAY_CARDTRADENUM} {/* 카드결제 거래번호 */}
                                <br/>
                                PCD_PAY_CARDAUTHNO = {payResult.PCD_PAY_CARDAUTHNO} {/* 카드결제 승인번호 */}
                                <br/>
                                PCD_PAY_CARDRECEIPT = {payResult.PCD_PAY_CARDRECEIPT} {/* 카드전표 URL */}
                            </div>
                        )
                    } else if (payResult.PCD_PAY_TYPE === 'transfer') {
                        return (<div>
                                PCD_PAY_BANK = {payResult.PCD_PAY_BANK} {/* 은행코드 */}
                                <br/>
                                PCD_PAY_BANKNAME = {payResult.PCD_PAY_BANKNAME} {/* 은행명 */}
                                <br/>
                                PCD_PAY_BANKNUM = {payResult.PCD_PAY_BANKNUM} {/* 계좌번호(중간 6자리 * 처리) */}
                            </div>
                        )
                    }
                })()}
                PCD_PAY_TIME = {payResult.PCD_PAY_TIME} {/* 결제 시간 (format: yyyyMMddHHmmss, ex: 20210610142219) */}
                <br/>
                PCD_TAXSAVE_RST = {payResult.PCD_TAXSAVE_RST} {/* 현금영수증 발행결과 Y|N */}
            </div>
            <div>
                {(() => {
                    if (payResult.PCD_PAY_WORK === 'CERT') {
                        return (<div>
                                <button id="payConfirmAction" style={{align: "center"}}
                                        onClick={handlePayConfirm}>결제승인요청
                                </button>
                            </div>
                        )
                    }
                })()}
                <button id="payConfirmCancel" style={{align: "center", display: "none"}}
                        onClick={handlePayRefund}>결제승인취소
                </button>
            </div>

            <div id='payConfirmResult'></div>

            <form id="payConfirm">
                <input type="hidden" name="PCD_PAY_TYPE" id="PCD_PAY_TYPE"
                       value={payResult.PCD_PAY_TYPE}/> {/*결제방법*/}
                <input type="hidden" name="PCD_AUTH_KEY" id="PCD_AUTH_KEY"
                       value={payResult.PCD_AUTH_KEY}/> {/*(필수)결제용 인증키 */}
                <input type="hidden" name="PCD_PAYER_ID" id="PCD_PAYER_ID"
                       value={payResult.PCD_PAYER_ID}/> {/*(transfer 일때 필수)결제자 고유ID (결제완료시 RETURN)*/}
                <input type="hidden" name="PCD_PAY_REQKEY" id="PCD_PAY_REQKEY"
                       value={payResult.PCD_PAY_REQKEY}/> {/*(필수)결제요청 고유KEY */}
                <input type="hidden" name="PCD_PAY_COFURL" id="PCD_PAY_COFURL"
                       value={payResult.PCD_PAY_COFURL}/> {/*(필수)결제승인요청 URL */}
            </form>
        </div>
    );
};

export default OrderResult;
