package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutySaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmTaskDutyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** 관리의무 등록 (AS-IS server/tdm/Tdm13_TaskRelateDuty, 위쪽 목록은 Tdm12_TaskRelateDetail.selectByText) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmTaskDutyService {

    private static final String TABLE = "tdm13_task_relate_duty";
    /** 화면번호 — AS-IS 화면 코드가 historyMap에 "1413"을 넣는다 */
    private static final String MENU_NO = "1413";

    private final TdmTaskDutyMapper mapper;
    private final TdmChangeHistoryService historyService;

    /** AS-IS tdm.Tdm12_TaskRelateDetail.selectByText (searchText는 '%…%'로 감싼다, taskTypeCode '%'=전체) */
    public List<TaskDutyDetailRes> searchDetails(UserPrincipal user, LocalDate baseDate, String taskTypeCode, boolean allYn, String searchText) {
        return mapper.selectDetailsByText(user.getCompanyId(), baseDate, taskTypeCode, allYn, "%" + searchText + "%");
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId */
    public List<TaskDutyRes> search(UserPrincipal user, Long taskRelateDetailId) {
        return mapper.selectByTaskRelateDetailId(user.getCompanyId(), taskRelateDetailId);
    }

    /** AS-IS tdm.Tdm13_TaskRelateDuty.countByDutyId: 사용 건수 합 */
    public int countUse(List<Long> dutyIds) {
        int sum = 0;
        for (Long id : dutyIds) {
            sum += mapper.countByDutyId(id);
        }
        return sum;
    }

    /**
     * AS-IS Tdm13_TaskRelateDuty.update: 기존 행을 고쳤으면 변경사유와 함께 G-UPDATE 변경이력(고친 열만, 행마다 targetKeyId)을
     * 먼저 만들고 저장. 신규 행(ID null/≤0)만 저장할 때는 사유가 필요 없다. 저장한 행을 요청 순서로 돌려준다.
     */
    @Transactional
    public List<TaskDutyRes> save(UserPrincipal user, TaskDutySaveReq req) {
        List<TaskDutyRes> rows = req.rows() == null ? List.of() : req.rows();
        for (TaskDutyRes row : rows) {
            if (row.content() == null || row.content().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "관리의무를 입력하세요");
            }
            if (row.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순서를 입력하세요");
            }
            checkCompany(user, row.taskRelateDetailId());
        }

        // 변경이력: 기존 행의 바뀐 열만 (AS-IS는 사용자가 고친 열)
        List<List<Map<String, String>>> modiRowList = new ArrayList<>();
        for (TaskDutyRes row : rows) {
            if (isNew(row.taskRelateDutyId())) {
                continue;
            }
            TaskDutyRes origin = mapper.selectById(row.taskRelateDutyId());
            if (origin == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            String key = row.taskRelateDutyId().toString();
            List<Map<String, String>> cols = new ArrayList<>();
            if (!Objects.equals(origin.content(), row.content())) {
                cols.add(col("관리의무", "tdm13_content", row.content(), key));
            }
            if (!Objects.equals(origin.seq(), row.seq())) {
                cols.add(col("조회순서", "tdm13_seq", row.seq().toString(), key));
            }
            if (!Objects.equals(yn(origin.useYn()), yn(row.useYn()))) {
                cols.add(col("사용여부", "tdm13_use_yn", yn(row.useYn()), key));
            }
            if (!cols.isEmpty()) {
                modiRowList.add(cols);
            }
        }
        if (!modiRowList.isEmpty()) {
            if (req.reason() == null || req.reason().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "저장이 취소되었습니다 (사유 미입력)");
            }
            Map<String, Object> history = historyService.newHistory(user, MENU_NO, "G-UPDATE", TABLE, req.reason());
            history.put("modiColumnList", modiRowList);
            historyService.insertModifyHistory(history);
        }

        List<Long> ids = new ArrayList<>();
        for (TaskDutyRes row : rows) {
            TaskDutyRes normalized = new TaskDutyRes(row.taskRelateDutyId(), row.taskId(), row.taskRelateDetailId(), row.content(), row.seq(), yn(row.useYn()));
            if (isNew(row.taskRelateDutyId())) {
                Long newId = mapper.selectNextId();
                mapper.insertDuty(newId, normalized, user.getName());
                ids.add(newId);
            } else {
                if (mapper.updateDuty(normalized, user.getName()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                ids.add(row.taskRelateDutyId());
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm13_TaskRelateDuty.delete: 사용이력이 있으면 중단, 삭제이력을 만든 뒤 삭제 */
    @Transactional
    public int delete(UserPrincipal user, TaskDeleteReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
        if (req.reason() == null || req.reason().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제가 취소되었습니다 (사유 미입력)");
        }
        for (Long id : req.ids()) {
            TaskDutyRes origin = mapper.selectById(id);
            if (origin != null) {
                checkCompany(user, origin.taskRelateDetailId());
            }
            if (mapper.countByDutyId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용이력이 있는 관리의무를 삭제 할 수 없습니다");
            }
            historyService.insertDeleteHistory(user, MENU_NO, TABLE, id, req.reason());
        }
        return mapper.deleteDuties(req.ids());
    }

    /** 세부내용이 로그인 회사의 책무 것이어야 한다 */
    private void checkCompany(UserPrincipal user, Long taskRelateDetailId) {
        if (taskRelateDetailId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = mapper.selectDetailCompany(taskRelateDetailId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static boolean isNew(Long id) {
        return id == null || id <= 0;
    }

    private static Map<String, String> col(String item, String column, String after, String key) {
        Map<String, String> col = TdmChangeHistoryService.column(item, column, after);
        col.put("targetKeyId", key);
        return col;
    }

    private static String yn(String v) {
        return "true".equals(v) ? "true" : "false";
    }
}
