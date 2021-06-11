import axios from "axios";


/*
 * 가맹점 인증 함수
 * 케이스별로 가맹점 인증 요청에 사용하는 요청변수가 다르니, Payple에서 제공하는 가이드를 통해 요청변수를 확인하시길 바랍니다.
 * ref: http://docs.payple.kr/bank/install/auth
 *
 * CORS 문제 발생시 참고 링크 : http://docs.payple.kr/faq
 */
export const authenticate = (obj = {}) => {
    const form = new FormData();

    form.append('cst_id', process.env.REACT_APP_CST_ID);         // 가맹점 ID (실결제시 .env 파일내 발급받은 운영ID를 작성하시기 바랍니다.)
    form.append('custKey', process.env.REACT_APP_CUST_KEY);      // 가맹점 Key (실결제시 .env 파일내 발급받은 운영Key를 작성하시기 바랍니다.)

    //상황별 가맹점 인증 추가 파라미터
    /*
     * PCD_PAY_WORK: req.body.PCD_PAY_WORK,                              // 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)
     * PCD_PAYCANCEL_FLAG: req.body.PCD_PAYCANCEL_FLAG,                  // 환불(승인취소) 요청변수
     *
     */
    for (const key in obj) {
        form.append(key, obj[key]);
    }

    // 인증 서버에 가맹점 인증 요청
    return axios.post(process.env.REACT_APP_AUTH_URL, form, {
        header: {
            'content-type': 'application/json',
            'referer': process.env.REACT_APP_PCD_HTTP_REFERRER          // API 서버를 따로 두고 있는 경우, Referer 에 가맹점의 도메인 고정
        }
    });
}

/**
 * return json
 {
        server_name: 'testcpay.payple.kr',
        result: 'success',
        result_msg: '사용자 인증 완료!!',
        cst_id: 'ZnRSL1Z2YlNqUjhaMDRVSzZWckhHdz09',
        custKey: 'TkdCdkFjcmhtTkdsaG1pSzhPYVY0Zz09',
        AuthKey: 'K0VnWlZ5TWZSaGNla1Vpay96YnNQQTFnYXcyVWxlSzJGTHdtNHpNTndIUmJIZ2IrUFI1VExnZzhvOGNqS2MwR0RXL2ZVVjNXbUNBSG43ajdJNXJlelZuKzBXenZNa2RQSGMwdzJlNndBS3dwMTF4Y29OMkdEaFI4RjZSQVpidVpMNGdDWGpTSWQ2bjJOZWRCOHVGdHZEZDhZZk82WkcxZUJia3piMTBvOFdaTStYL1B5UEt2MTlLMVdRMlE2UXQ2dm1Od08ySnhCVU91UHNYZ1RyQ01TUm9HeWNDTUFnbE96TDlBR09ZYmNNd2VSOXVCNnEvUnplaEdUNWdqRW42RTZGRzZ6NzdLdExHcWpyMFcvb2I2SWc9PQ==',
        PCD_PAY_HOST: 'https://testcpay.payple.kr',
        PCD_PAY_URL: '/index.php?ACT_=PAYM&CPAYVER=202105281747',
        return_url: 'https://testcpay.payple.kr/index.php?ACT_=PAYM&CPAYVER=202105281747'
    }
 */