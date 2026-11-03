package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrEmpAuthTargetRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrEmpAuthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 조회권한 예외사원 등록 (EE08 Dcr04_Tab_EmpAuth) — AS-IS dcr.Dcr04_EmpAuth */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrEmpAuthService {

    private final DcrEmpAuthMapper mapper;

    /** AS-IS selectByText: 문서분류의 예외사원. 검색어는 부서·성명·직위·사원구분 이어붙인 글자에서 찾는다 */
    public List<DcrEmpAuthRes> search(UserPrincipal user, Long classTreeId, String searchText) {
        requireClassTree(user.getCompanyId(), classTreeId);
        return mapper.selectByText(user.getCompanyId(), classTreeId, like(searchText));
    }

    /** AS-IS getTargetList: 예외 권한이 하나라도 있는 사원 (사원별 권한현황 창) */
    public List<DcrEmpAuthTargetRes> searchTargets(UserPrincipal user, String searchText) {
        return mapper.selectTargets(user.getCompanyId(), like(searchText));
    }

    /** AS-IS getTargetClassTreeList: 사원 한 명의 예외 문서분류 */
    public List<DcrEmpAuthClassRes> searchTargetClassTrees(UserPrincipal user, Long personId, String searchText) {
        return mapper.selectTargetClassTrees(user.getCompanyId(), personId, like(searchText));
    }

    /** AS-IS updateList: 이미 있는 (사원, 문서분류)는 비고만 고치고 없으면 넣는다 → 처리한 행 수 */
    @Transactional
    public int update(UserPrincipal user, DcrEmpAuthSaveReq req) {
        if (req == null || req.rows() == null) {
            return 0;
        }
        int count = 0;
        for (DcrEmpAuthSaveReq.Row row : req.rows()) {
            requireClassTree(user.getCompanyId(), row.classTreeId());
            if (row.personId() == null || mapper.countPerson(user.getCompanyId(), row.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "사원을 찾을 수 없습니다.");
            }
            if (mapper.countAuth(row.personId(), row.classTreeId()) == 0) {
                count += mapper.insertAuth(row.personId(), row.classTreeId(), row.note());
            } else {
                count += mapper.updateNote(row.personId(), row.classTreeId(), row.note());
            }
        }
        return count;
    }

    /** AS-IS delete(체크한 행) → 지운 행 수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteAuths(user.getCompanyId(), ids);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    private void requireClassTree(Long companyId, Long classTreeId) {
        if (classTreeId == null || mapper.countClassTree(companyId, classTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "문서분류를 찾을 수 없습니다.");
        }
    }
}
