package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpSignRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpSignSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpSignMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp60_Sign.java (G09 Emp60_Tab_Sign) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpSignService {

    private final EmpSignMapper mapper;

    /** AS-IS Emp60_Sign.selectByPersonId L25: 로그인 사원의 서명 */
    public List<EmpSignRes> search(UserPrincipal user) {
        return mapper.selectByPersonId(user.getUserId());
    }

    /**
     * AS-IS Emp60_Tab_Sign.update() L162-213 검사(요청 + 목록 밖 내 서명 중 사용 1개 이하) → Emp60_Sign.update(UpdateDataModel).
     * 새 행(signId 없음·0 이하)은 새 ID로 INSERT. 저장한 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<EmpSignRes> save(UserPrincipal user, List<EmpSignSaveReq> rows) {
        Long personId = user.getUserId();
        Long companyId = user.getCompanyId();
        List<Long> sentIds = rows.stream().map(EmpSignSaveReq::signId).filter(id -> id != null && id > 0).toList();
        long used = rows.stream().filter(r -> "true".equals(r.useYn())).count() + mapper.countUsedNotIn(companyId, personId, sentIds);
        if (used > 1) {
            throw invalid("하나의 서명만 사용가능합니다. 사용여부체크를 확인해주세요");
        }
        return rows.stream().map(r -> {
            boolean isNew = r.signId() == null || r.signId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.signId();
            EmpSignSaveReq row = new EmpSignSaveReq(id, r.useYn(), r.note());
            if (isNew) {
                mapper.insertSign(companyId, personId, row);
            } else if (mapper.updateSign(companyId, personId, row) == 0) {
                throw invalid("서명을 찾을 수 없습니다");
            }
            return mapper.selectById(personId, id);
        }).toList();
    }

    /** AS-IS Emp60_Sign.deleteChk L48: 결재선에서 쓴 서명이 하나라도 있으면 true */
    public boolean isUsed(UserPrincipal user, List<Long> ids) {
        return mapper.countApprStepBySignIds(user.getCompanyId(), positive(ids)) > 0;
    }

    /** AS-IS Emp60_Sign.delete L70 → UpdateDataModel.deleteModel. 화면이 먼저 deleteChk를 부르지만 서버도 다시 막는다. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (isUsed(user, ids)) {
            throw invalid("사용중인 서명은 삭제가 불가능합니다");
        }
        return positive(ids).stream().mapToInt(id -> mapper.deleteSign(user.getCompanyId(), user.getUserId(), id)).sum();
    }

    private static List<Long> positive(List<Long> ids) {
        return ids.stream().filter(id -> id != null && id > 0).toList();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
