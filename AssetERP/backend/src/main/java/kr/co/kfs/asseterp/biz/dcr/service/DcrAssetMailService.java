package kr.co.kfs.asseterp.biz.dcr.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrAssetMailReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrMailSenderMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.mail.AssetMailClient;
import lombok.RequiredArgsConstructor;

/**
 * 새 메일 시스템으로 메일 쓰기 (AS-IS client/utils/AssetMailSend 생성자 L20-84 — Dcr10_Lookup_MailSender [예]).
 * 원본은 화면이 세 번 부른다: ① sys.Sys10_File.selectApprRelateDoc(첨부 파일 ID) ② eml.Eml01_SendHistory.insert(refKey)
 * ③ utils.mail.SendMailSMTP.assetMailSend(SSO 토큰 TokenService.returnToken → AssetMailSend.openMailWrite). TOBE는 한 번에 한다.
 * 원본과 다른 점:
 *  - ② eml01_send_history 테이블이 asseterpdb에 없어(2026-11-10 information_schema 확인) 발송 기록 행을 넣지 않고 refKey만 f_create_seq()로 만든다.
 *  - 결재문서가 로그인 회사의 것인지 확인한다(원본에는 없음).
 *  - 원본은 수신자(receptor)를 서버에 넘기지만 assetMailSend가 읽지 않는다 — TOBE는 받지 않는다(같은 결과).
 */
@Service
@RequiredArgsConstructor
public class DcrAssetMailService {

    private static final SecureRandom TOKEN_RANDOM = new SecureRandom();
    private static final Base64.Encoder TOKEN_ENCODER = Base64.getUrlEncoder().withoutPadding();

    private final DcrMailSenderMapper mapper;
    private final AssetMailClient client;

    /** 메일 작성 화면 주소(open_url) */
    @Transactional
    public String openMailWrite(UserPrincipal user, DcrAssetMailReq req) {
        Long apprId = req.apprId();
        if (apprId == null || mapper.countApprInCompany(apprId, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재문서를 찾을 수 없습니다.");
        }
        // ① 문서 첨부 + 관련문서 첨부의 파일 ID (글자)
        List<String> fileList = mapper.selectApprRelateDoc(apprId).stream().map(f -> String.valueOf(f.fileId())).toList();
        // ② refKey (원본 Eml01_SendHistory.insert의 dbConfig.getSeq)
        Long refKey = mapper.selectNextId();
        // ③ TokenService.returnToken L46-74: 옛 토큰을 지우고 새 토큰
        String token = generateToken();
        mapper.deleteTokenByPersonId(user.getUserId());
        mapper.insertToken(user.getCompanyId(), user.getUserId(), token);
        return client.openMailWrite(refKey, req.header(), req.content(), String.valueOf(apprId), user.getUserId(), fileList, token);
    }

    /** TokenService.generateToken L97-101 */
    private static String generateToken() {
        byte[] bytes = new byte[32];
        TOKEN_RANDOM.nextBytes(bytes);
        return TOKEN_ENCODER.encodeToString(bytes);
    }
}
