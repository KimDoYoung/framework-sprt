package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckReq;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailCheckRes;
import kr.co.kfs.asseterp.biz.cmp.service.CmpMailBookService;
import kr.co.kfs.asseterp.biz.sys.dto.SysMailRes;
import kr.co.kfs.asseterp.biz.sys.dto.SysMailSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys22_Mail.java (Sys22_Lookup_Mail 팝업 — 회사 메일 등록·수정 + 검증) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMailService {

    private final SysMailMapper mapper;
    /** 검증(SendMailSMTP.checkCompanyMail)은 공용메일(G13)이 이미 옮겨 둔 것과 같은 코드다 */
    private final CmpMailBookService mailCheck;

    /** AS-IS Sys22_Mail.modelUpdate L22-34: 비밀번호를 암호화(dbConfig.getEncrypts)하고, ID가 없으면 새 ID(dbConfig.getSeq)로 넣고 있으면 고친다 */
    @Transactional
    public SysMailRes save(UserPrincipal user, Long mailId, SysMailSaveReq req) {
        String password = mapper.getEncrypts(req.mailDecPassword());
        Long id = mailId;
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertMail(id, user.getCompanyId(), req.mailAddress(), password, req.note());
        } else if (mapper.updateMail(user.getCompanyId(), id, req.mailAddress(), password, req.note()) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회사 메일을 찾을 수 없습니다");
        }
        return mapper.selectById(user.getCompanyId(), id);
    }

    /** AS-IS utils.mail.SendMailSMTP.checkCompanyMail — 시험 메일 발송 */
    public CmpMailCheckRes check(UserPrincipal user, CmpMailCheckReq req) {
        return mailCheck.check(user, req);
    }
}
