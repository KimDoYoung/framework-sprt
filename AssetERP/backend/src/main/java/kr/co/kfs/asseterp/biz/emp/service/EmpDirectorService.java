package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorPrintReq;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorRes;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorRow;
import kr.co.kfs.asseterp.biz.emp.dto.DirectorSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpDirectorMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 임원정보 관리 (AS-IS Emp31_Tab_Director → emp.Emp31_Director.selectByText·updateList, sys.Sys99_Print.insertRdDirector01·02) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpDirectorService {

    /** AS-IS 가 출력 두 종류를 화면 클래스명에 01·02를 붙여 따로 저장한다 */
    private static final String WINDOW_SENIOR = "Emp31_Tab_Director01";
    private static final String WINDOW_TOTAL = "Emp31_Tab_Director02";

    private final EmpDirectorMapper mapper;

    /** AS-IS emp.Emp31_Director.selectByText — endCheck(해임임원 포함)가 false 면 해임일이 지난 임원은 뺀다 */
    public List<DirectorRes> search(UserPrincipal user, String searchText, boolean endCheck) {
        return mapper.selectByText(user.getCompanyId(), like(searchText), endCheck);
    }

    /**
     * AS-IS emp.Emp31_Director.updateList L36: 사원(personId)의 emp31_director 행이 있으면 그 ID 로 UPDATE, 없으면 새 ID 로 INSERT.
     * AS-IS 는 사원이 로그인 회사 소속인지 보지 않지만(회사 컬럼 없음) TOBE 는 다른 회사 사원의 행을 쓰지 못하게 소속을 확인한다.
     */
    @Transactional
    public int update(UserPrincipal user, List<DirectorSaveReq> rows) {
        int count = 0;
        for (DirectorSaveReq req : rows) {
            if (mapper.countPerson(user.getCompanyId(), req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            Long directorId = mapper.selectDirectorIdByPersonId(req.personId());
            boolean isNew = directorId == null;
            if (isNew) {
                directorId = mapper.selectNextId();
            }
            DirectorRow row = new DirectorRow(directorId, req.personId(), req.initAssignDate(), req.rcntAssingDate(), req.expireDate(),
                    req.assignCnt(), req.addTitle(), req.qualified(), req.preferStock(), req.commonStock(), req.endDate(), req.endReason(), req.note());
            count += isNew ? mapper.insertDirector(row) : mapper.updateDirector(row);
        }
        return count;
    }

    /** AS-IS sys.Sys99_Print.insertRdDirector01 L2944: 고른 임원(선임/해임 보고 대상)의 출력 자료 → 그룹 ID(seniorGroupId) */
    @Transactional
    public String insertRdSenior(UserPrincipal user, DirectorPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_SENIOR);
        mapper.insertPrintSenior(user.getCompanyId(), user.getUserId(), WINDOW_SENIOR, groupId, like(req.searchText()), false, req.personIds());
        return String.valueOf(groupId);
    }

    /** AS-IS sys.Sys99_Print.insertRdDirector02 L3019: 전체 현황(해임임원 제외)의 출력 자료 → 그룹 ID(totalGroupId) */
    @Transactional
    public String insertRdTotal(UserPrincipal user, DirectorPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_TOTAL);
        mapper.insertPrintTotal(user.getCompanyId(), user.getUserId(), WINDOW_TOTAL, groupId, like(req.searchText()), false);
        return String.valueOf(groupId);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
