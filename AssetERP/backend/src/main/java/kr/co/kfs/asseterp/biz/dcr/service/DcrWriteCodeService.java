package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteCodeRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrWriteCodeMapper;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys09_Code.java selectByDcrLv1 L232 / Lv2 L243 / Lv3 L255 / selectByDcrDetail L267 — 문서작성 분류 콤보 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrWriteCodeService {

    private final DcrWriteCodeMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** level 1=대분류, 2=중분류, 3=문서분류. 2·3단계는 부모(dcrParentId)를 준다 */
    public List<DcrWriteCodeRes> searchClassCodes(UserPrincipal user, int level, Long dcrParentId) {
        if (level < 1 || level > 3) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류 단계는 1~3입니다");
        }
        return mapper.selectClassCodes(user.getCompanyId(), orgCodeIdOf(user), level, level == 1 ? null : dcrParentId);
    }

    public List<DcrWriteCodeRes> searchDetailCodes(Long classTreeId) {
        return mapper.selectDetailCodes(classTreeId);
    }

    /** AS-IS LoginUser.getOrgCodeId(): 회사관리자(userId < 0)는 0, 사원은 현재 발령의 조직 */
    private Long orgCodeIdOf(UserPrincipal user) {
        if (user.getUserId() < 0) {
            return 0L;
        }
        return transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
    }
}
