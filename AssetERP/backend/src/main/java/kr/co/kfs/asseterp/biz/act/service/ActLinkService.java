package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.ActCodeOptionRes;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkCreateReq;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActLinkMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/act/Act14_Link.java (selectByAccountCode L24, insert L36, updateList L54, delete L66) + 편집창의 ProvideContentCode 콤보 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActLinkService {

    private final ActLinkMapper mapper;

    /** AS-IS Act01_Edit_AccountCode.retrieveLink() L416-421: 로그인 회사의 그 계정 연결정보 */
    public List<ActLinkRes> search(UserPrincipal user, String accountCode) {
        return mapper.selectByAccountCode(user.getCompanyId(), accountCode);
    }

    /** AS-IS Act01_Edit_AccountCode.insertRow() L423-450: 목적·내용 필수는 원본이 화면에서만 검사했다 */
    @Transactional
    public ActLinkRes create(UserPrincipal user, ActLinkCreateReq req) {
        if (req.accountCode() == null || req.accountCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계정코드는 필수입력 항목입니다");
        }
        if (req.provideContentCode() == null || req.provideContentCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이익제공(수령) 내용을 선택해주세요");
        }
        Long id = mapper.selectNextId();
        mapper.insert(id, user.getCompanyId(), req.accountCode(), req.provideContentCode());
        return mapper.selectById(id);
    }

    /** AS-IS Act01_Edit_AccountCode.getSeq() L387-414: ▲▼로 순서를 바꾸면 보이는 순서대로 조회순서를 1부터 다시 매긴다 → 바뀐 건수 */
    @Transactional
    public int order(UserPrincipal user, List<Long> ids) {
        int seq = 0;
        int count = 0;
        for (Long id : ids) {
            count += mapper.updateSeq(user.getCompanyId(), id, ++seq);
        }
        return count;
    }

    /** AS-IS act.Act14_Link.delete → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /** AS-IS Act01_Edit_AccountCode.refreshCode() L223-230: 목적코드로 시작하는 ProvideContentCode */
    public List<ActCodeOptionRes> provideContents(String purposeCode) {
        return mapper.selectProvideContents(purposeCode + "%");
    }
}
