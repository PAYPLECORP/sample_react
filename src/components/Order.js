import React, {useState} from "react";
import {useHistory} from "react-router";
import $ from "jquery";

function Order() {
    const history = useHistory();
    const [content] = useState({
        // Default form set
        is_direct: 'N',                               // 결제창 방식 (DIRECT: Y | POPUP: N)
        pay_type: 'transfer',                         // 결제수단
        work_type: 'CERT',                            // 결제요청방식
        card_ver: '',                                 // DEFAULT: 01 (01: 정기결제 플렛폼, 02: 일반결제 플렛폼), 카드결제 시 필수
        payple_payer_id: '',                          // 결제자 고유ID (본인인증 된 결제회원 고유 KEY)
        buyer_no: '2335',                             // 가맹점 회원 고유번호
        buyer_name: '홍길동',                         // 결제자 이름
        buyer_hp: '01012345678',                      // 결제자 휴대폰 번호
        buyer_email: 'test@payple.kr',                // 결제자 Email
        buy_goods: '휴대폰',                          // 결제 상품
        buy_total: '1000',                            // 결제 금액
        buy_istax: 'Y',                               // 과세여부 (과세: Y | 비과세(면세): N)
        buy_taxtotal: '',                             // 부가세(복합과세인 경우 필수)
        order_num: createOid(),                       // 주문번호
        pay_year: '',                                 // [정기결제] 결제 구분 년도
        pay_month: '',                                // [정기결제] 결제 구분 월
        is_reguler: 'N',                              // 정기결제 여부 (Y | N)
        is_taxsave: 'N',                              // 현금영수증 발행여부
        simple_flag: 'N',                             // 간편결제 여부
        auth_type: 'sms'                              // [간편결제/정기결제] 본인인증 방식 (sms : 문자인증 | pwd : 패스워드 인증)
    });

    const handleChange = (e) => {
        content[e.target.name] = e.target.value;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push({
            pathname: '/react/order_confirm',
            state: {content: content},
        });
    }

    return (
        <div>
            <form id="orderForm" name="orderForm" onChange={handleChange}>
                <div>
                    <select name="simple_flag">
                        <option value="N">단건결제</option>
                        <option value="Y">간편결제</option>
                    </select>
                </div>
                <div>
                    <select name="is_direct">
                        <option value="N">POPUP</option>
                        <option value="Y">DIRECT</option>
                    </select>
                </div>
                <div>
			<span> <select id="pay_type" name="pay_type">
					<option value="transfer">계좌이체결제</option>
					<option value="card">신용카드</option>
			</select>
			</span> <span id="card_ver_view" style={{display: content.pay_type !== "card" ? "none" : ""}}>
                    <select id="card_ver" name="card_ver">
					<option value=''>=결제창 선택=</option>
					<option value="01">카드 정기</option>
					<option value="02">카드 일반</option>
			</select>
			</span>
                </div>
                <div>
                    <label htmlFor="payple_payer_id">[간편결제] 페이플 결제자 ID</label> <input
                    type="text" name="payple_payer_id" id="payple_payer_id" defaultValue=""/>
                </div>
                <div>
                    <label htmlFor="payer_no">구매자 고유번호</label> <input type="text"
                                                                      name="buyer_no" id="buyer_no"
                                                                      defaultValue={content.buyer_no}/>
                </div>
                <div>
                    <label htmlFor="buyer_name">구매자 이름</label> <input type="text"
                                                                      name="buyer_name" id="buyer_name"
                                                                      defaultValue={content.buyer_name}/>
                </div>
                <div>
                    <label htmlFor="buyer_hp">구매자 휴대폰번호</label> <input type="text"
                                                                       name="buyer_hp" id="buyer_hp"
                                                                       defaultValue={content.buyer_hp}/>
                </div>
                <div>
                    <label htmlFor="buyer_email">구매자 Email</label> <input type="text"
                                                                          name="buyer_email" id="buyer_email"
                                                                          defaultValue={content.buyer_email}/>
                </div>
                <div>
                    <label htmlFor="buy_goods">구매상품</label> <input type="text"
                                                                   name="buy_goods" id="buy_goods"
                                                                   defaultValue={content.buy_goods}/>
                </div>
                <div>
                    <label htmlFor="buy_total">결제금액</label> <input type="text"
                                                                   name="buy_total" id="buy_total"
                                                                   defaultValue={content.buy_total}/>
                </div>
                <div>
                    <label htmlFor="buy_istax">과세여부</label> <select id="buy_istax"
                                                                    name="buy_istax">
                    <option value="Y">과세</option>
                    <option value="N">비과세</option>
                </select>
                </div>
                <div>
                    <label htmlFor="buy_taxtotal">부가세</label> <input type="text"
                                                                     name="buy_taxtotal" id="buy_taxtotal"
                                                                     defaultValue=""/>
                </div>
                <div>
                    <label htmlFor="order_num">주문번호</label> <input type="text"
                                                                   name="order_num" id="order_num"
                                                                   defaultValue={content.oid}/>
                </div>
                <div id="is_reguler_view">
                    <label htmlFor="is_reguler">정기결제</label> <select id="is_reguler"
                                                                     name="is_reguler">
                    <option value="N">N</option>
                    <option value="Y">Y</option>
                </select>
                </div>
                <div id="pay_year_view">
                    <label htmlFor="pay_year">정기결제 구분년도</label>
                    <select id="pay_year" name="pay_year">
                        <option value="">===</option>
                        <option value='2021'>2021</option>
                        <option value='2020'>2020</option>
                        <option value='2019'>2019</option>
                    </select>
                </div>
                <div id="pay_month_view">
                    <label htmlFor="pay_month">정기결제 구분월</label> <select id="pay_month"
                                                                        name="pay_month">
                    <option value="">===</option>
                    <option value="12">12</option>
                    <option value="11">11</option>
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
                </div>
                <div id="taxsave_view">
                    <label htmlFor="is_taxsave">현금영수증</label> <select id="is_taxsave"
                                                                      name="is_taxsave">
                    <option value="N">N</option>
                    <option value="Y">Y</option>
                </select>
                </div>
                <div>
                    <label htmlFor="work_type">결제요청방식</label> <select id="work_type"
                                                                      name="work_type">
                    <option value="CERT">결제요청->결제확인->결제완료</option>
                    <option value="PAY">결제요청->결제완료</option>
                    <option value="AUTH">인증</option>
                </select>
                </div>
                <div>
                    <label htmlFor="auth_type">재결제 인증방식</label> <select id="auth_type"
                                                                        name="auth_type">
                    <option value="sms">문자</option>
                    <option value="pwd">패스워드</option>
                </select>
                </div>
            </form>
            <button id="orderFormSubmit" onClick={handleSubmit}>상품구매</button>
        </div>
    );
}

$(document).ready(function () {
    $("#card_ver_view").css('display', 'none');
    // 결제 타입에 따라 관련 selectTag의 css속성 변경
    $("#pay_type").on('change', function (e) {

        e.preventDefault();
        const this_val = $(this).val();

        if (this_val === 'card') {
            $("#taxsave_view").css('display', 'none');
            $("#card_ver_view").css('display', '');
        } else {
            $("#taxsave_view").css('display', '');
            $("#card_ver_view").css('display', 'none');
        }
        //카드 결제유형(정기, 일반)에 따라 selectTag의 css속성 변경
        $('#card_ver').on('change', function () {
            if ($(this).val() === '01') {
                $('#is_reguler_view').css('display', '');
                $('#pay_year_view').css('display', '');
                $('#pay_month_view').css('display', '');
                $('#work_type option[value*="AUTH"]').prop('disabled', false);
            } else {
                $('#is_reguler_view').css('display', 'none');
                $('#pay_year_view').css('display', 'none');
                $('#pay_month_view').css('display', 'none');
                $('#work_type option[value*="AUTH"]').prop('disabled', true);
            }
        });
    });
});

/* Oid 생성 함수
 * 리턴 예시: test202105281622170718461
 */
const createOid = () => {
    const now_date = new Date();
    let now_year = now_date.getFullYear()
    let now_month = now_date.getMonth() + 1
    now_month = (now_month < 10) ? '0' + now_month : now_month
    let now_day = now_date.getDate()
    now_day = (now_day < 10) ? '0' + now_day : now_day
    const datetime = now_date.getTime();
    return 'test' + now_year + now_month + now_day + datetime;
};


export default Order;
