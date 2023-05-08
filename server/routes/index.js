const express = require("express");
const axios = require("axios");
const router = express.Router();

/* POST /api
 * IOS, AOS앱 및 인앱브라우저에서는 결제창 호출 방식을 다이렉트로 연결해야 합니다.
 * 다이렉트 호출 방식은 결제 페이지로 이동 후, 결제가 완료되면 POST를 통해 결제 결과 파라미터를 보내줍니다.
 * ref: https://developer.payple.kr/service/faq
 */
router.post('/', (req, res) => {
    const data = {
        PCD_PAY_RST: req.body.PCD_PAY_RST,                      // 결제요청 결과(success|error)
        PCD_PAY_MSG: req.body.PCD_PAY_MSG,                      // 결제요청 결과 메시지
        PCD_PAY_OID: req.body.PCD_PAY_OID,                      // 주문번호
        PCD_PAY_TYPE: req.body.PCD_PAY_TYPE,                    // 결제 방법 (transfer | card)
        PCD_PAY_WORK: req.body.PCD_PAY_WORK,                    // 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)
        PCD_PAYER_ID: req.body.PCD_PAYER_ID,                    // 카드등록 후 리턴받은 빌링키
        PCD_PAYER_NO: req.body.PCD_PAYER_NO,                    // 가맹점 회원 고유번호
        PCD_PAYER_NAME: req.body.PCD_PAYER_NAME,                // 결제자 이름
        PCD_PAYER_EMAIL: req.body.PCD_PAYER_EMAIL,              // 결제자 Email
        PCD_REGULER_FLAG: req.body.PCD_REGULER_FLAG,            // 정기결제 여부 (Y | N)
        PCD_PAY_YEAR: req.body.PCD_PAY_YEAR,                    // 결제 구분 년도 (PCD_REGULER_FLAG 사용시 응답)
        PCD_PAY_MONTH: req.body.PCD_PAY_MONTH,                  // 결제 구분 월 (PCD_REGULER_FLAG 사용시 응답)
        PCD_PAY_GOODS: req.body.PCD_PAY_GOODS,                  // 결제 상품
        PCD_PAY_TOTAL: req.body.PCD_PAY_TOTAL,                  // 결제 금액
        PCD_PAY_TAXTOTAL: req.body.PCD_PAY_TAXTOTAL,            // 복합과세(과세+면세) 주문건에 필요한 금액이며 가맹점에서 전송한 값을 부가세로 설정합니다. 과세 또는 비과세의 경우 사용하지 않습니다.
        PCD_PAY_ISTAX: req.body.PCD_PAY_ISTAX,                  // 과세설정 (Default: Y, 과세:Y, 복합과세:Y, 비과세: N)
        PCD_PAY_CARDNAME: req.body.PCD_PAY_CARDNAME,            // [카드결제] 카드사명
        PCD_PAY_CARDNUM: req.body.PCD_PAY_CARDNUM,              // [카드결제] 카드번호 (ex: 1234-****-****-5678)
        PCD_PAY_CARDTRADENUM: req.body.PCD_PAY_CARDTRADENUM,    // [카드결제] 카드결제 거래번호
        PCD_PAY_CARDAUTHNO: req.body.PCD_PAY_CARDAUTHNO,        // [카드결제] 카드결제 승인번호
        PCD_PAY_CARDRECEIPT: req.body.PCD_PAY_CARDRECEIPT,      // [카드결제] 카드전표 URL
        PCD_PAY_TIME: req.body.PCD_PAY_TIME,                    // 결제 시간 (format: yyyyMMddHHmmss, ex: 20210610142219)
        PCD_TAXSAVE_RST: req.body.PCD_TAXSAVE_RST,              // 현금영수증 발행결과 (Y | N)
        PCD_AUTH_KEY: req.body.PCD_AUTH_KEY,                    // 결제용 인증키
        PCD_PAY_REQKEY: req.body.PCD_PAY_REQKEY,                // 결제요청 고유 KEY
        PCD_PAY_COFURL: req.body.PCD_PAY_COFURL                 // 결제승인요청 URL
    };

    // React로 값 전송 (url parameters)
    res.redirect(process.env.REACT_APP_HOSTNAME + '/react/order_result?' + encodeURIComponent(JSON.stringify(data)));
});

/* POST /api/auth
   파트너 인증
 */
router.post('/auth', async (req, res, next) => {
    try {
        const caseParams = req.body;                           // 상황별 파트너 인증 파라미터
        const params = {
            cst_id: process.env.REACT_APP_CST_ID,                        // 파트너 ID (실결제시 발급받은 운영ID를 작성하시기 바랍니다.)
            custKey: process.env.REACT_APP_CUST_KEY,                     // 파트너 인증키 (실결제시 발급받은 운영Key를 작성하시기 바랍니다.)
            ...caseParams
        };

        /*  ※ Referer 설정 방법
            TEST : referer에는 테스트 결제창을 띄우는 도메인을 넣어주셔야합니다. 결제창을 띄울 도메인과 referer값이 다르면 [AUTH0007] 응답이 발생합니다.
            REAL : referer에는 가맹점 도메인으로 등록된 도메인을 넣어주셔야합니다.
            다른 도메인을 넣으시면 [AUTH0004] 응답이 발생합니다.
            또한, TEST에서와 마찬가지로 결제창을 띄우는 도메인과 같아야 합니다.
        */
        const {data} = await axios.post(process.env.REACT_APP_AUTH_URL, params, {
            headers: {
                'content-type': 'application/json',
                'referer': process.env.REACT_APP_HOSTNAME
            }
        });

        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});


module.exports = router;