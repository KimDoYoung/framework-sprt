package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/**
 * 메일 보내기 (AS-IS utils.mail.SendMailSMTP.sendMailSession / sendMailSessionTest 파라미터)
 *
 * @param publicCheck 공용메일 주소(공용 라디오), 본인 메일이면 null
 * @param testYn      사용료 청구 메일(erpFeeChargeOpen)이면 true — AS-IS sendMailSessionTest
 */
public record DcrMailSendReq(
        Long apprId,
        String receptor,
        String ccReceptor,
        String header,
        String content,
        String publicCheck,
        boolean privacyInfo,
        boolean testYn,
        List<Long> fileIds
) {
}
