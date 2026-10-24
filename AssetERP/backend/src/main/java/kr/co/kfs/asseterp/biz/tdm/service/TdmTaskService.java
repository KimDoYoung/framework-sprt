package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmTaskMapper;
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

/** 책무 (AS-IS server/tdm/Tdm10_Task) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmTaskService {

    private static final String TABLE = "tdm10_task";

    private final TdmTaskMapper mapper;
    private final TdmChangeHistoryService historyService;

    /** AS-IS Tdm10_Tab_Task.retrieve: taskClassCode·searchText는 %…%, 전체보기(allYn)면 기준일 조건 없음 */
    public List<TaskRes> search(UserPrincipal user, LocalDate baseDate, String taskClassCode, boolean allYn, String searchText) {
        return mapper.selectByText(user.getCompanyId(), baseDate == null ? LocalDate.now() : baseDate,
                taskClassCode == null || taskClassCode.isEmpty() ? "%" : taskClassCode, allYn,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    public TaskRes get(UserPrincipal user, Long taskId) {
        TaskRes res = mapper.selectById(user.getCompanyId(), taskId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS DBUtil.setSeq: 편집창을 열 때 미리 받는 새 책무 ID */
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS Tdm10_Task.countUseByTaskId: 선택한 책무들의 사용 건수 합 (0이 아니면 삭제 못 한다) */
    public int countUse(List<Long> taskIds) {
        int sum = 0;
        for (Long id : taskIds) {
            sum += mapper.countUseByTaskId(id);
        }
        return sum;
    }

    /**
     * AS-IS Tdm10_Task.modelUpdate (INSERT·COPY): 복사면 책무세부·주요관리의무를 새 책무로 복사(createCopy) 뒤 INSERT.
     * 등록은 변경이력을 만들지 않는다.
     */
    @Transactional
    public TaskRes create(UserPrincipal user, TaskSaveReq req) {
        validate(req);
        Long taskId = req.taskId() == null ? mapper.selectNextId() : req.taskId();
        if (req.oldTaskId() != null) {
            String resultMsg = mapper.createCopy(req.oldTaskId(), taskId);
            if (!"Y".equals(resultMsg)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, resultMsg == null ? "복제처리중 오류발생. 관리자에게 문의하세요" : resultMsg);
            }
        }
        mapper.insertTask(taskId, user.getCompanyId(), req, user.getName());
        return get(user, taskId);
    }

    /** AS-IS Tdm10_Task.modelUpdate (UPDATE): 변경 전 값과 비교한 변경이력을 먼저 만들고 UPDATE. 변경이 없으면 오류 */
    @Transactional
    public TaskRes update(UserPrincipal user, Long taskId, TaskSaveReq req) {
        validate(req);
        TaskRes origin = get(user, taskId);

        List<Map<String, String>> cols = new ArrayList<>();
        if (!Objects.equals(origin.taskClassCode(), req.taskClassCode())) {
            cols.add(TdmChangeHistoryService.column("책무구분", "tdm10_task_class_cd", req.taskClassCode()));
        }
        if (!Objects.equals(origin.taskTypeCode(), req.taskTypeCode())) {
            cols.add(TdmChangeHistoryService.column("책무유형", "tdm10_task_type_cd", req.taskTypeCode()));
        }
        if (!Objects.equals(origin.taskName(), req.taskName())) {
            cols.add(TdmChangeHistoryService.column("책무명", "tdm10_task_nm", req.taskName()));
        }
        if (!Objects.equals(yn(origin.commonYn()), yn(req.commonYn()))) {
            cols.add(TdmChangeHistoryService.column("공통책무여부", "tdm10_common_yn", yn(req.commonYn())));
        }
        if (!Objects.equals(yn(origin.ceoYn()), yn(req.ceoYn()))) {
            cols.add(TdmChangeHistoryService.column("CEO책무여부", "tdm10_ceo_yn", yn(req.ceoYn())));
        }
        if (!Objects.equals(origin.startDate(), req.startDate())) {
            cols.add(TdmChangeHistoryService.column("사용시작일", "tdm10_start_date", date(req.startDate())));
        }
        if (!Objects.equals(origin.endDate(), req.endDate())) {
            cols.add(TdmChangeHistoryService.column("사용종료일", "tdm10_end_date", date(req.endDate())));
        }
        if (cols.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경사항이 없습니다");
        }
        if (req.reason() == null || req.reason().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "변경사유가 입력되지 않았습니다.");
        }

        Map<String, Object> history = historyService.newHistory(user, "UPDATE", TABLE, req.reason());
        history.put("targetKeyId", taskId.toString());
        history.put("modiColumnList", cols);
        historyService.insertModifyHistory(history);

        TaskSaveReq toSave = new TaskSaveReq(taskId, req.taskClassCode(), req.taskTypeCode(), req.taskName(),
                yn(req.commonYn()), yn(req.ceoYn()), req.startDate(), req.endDate(), null, null);
        if (mapper.updateTask(user.getCompanyId(), toSave, user.getName()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return get(user, taskId);
    }

    /**
     * AS-IS Tdm10_Task.delete: 책무마다 사용이력을 검사하고(있으면 전체 중단), 삭제이력(DELETE)을 만든 뒤 삭제.
     * 삭제사유가 없으면 안 한다 (AS-IS 화면이 사유 없이는 요청을 보내지 않는다).
     */
    @Transactional
    public int delete(UserPrincipal user, TaskDeleteReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
        if (req.reason() == null || req.reason().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제가 취소되었습니다 (사유 미입력)");
        }
        for (Long id : req.ids()) {
            if (mapper.countUseByTaskId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용이력이 있는 책무는 삭제 할 수 없습니다");
            }
            historyService.insertDeleteHistory(user, TABLE, id, req.reason());
        }
        return mapper.deleteTasks(req.ids(), user.getCompanyId());
    }

    /** AS-IS Tdm10_Edit_Task.preUpdate L272-288 */
    private void validate(TaskSaveReq req) {
        if (isBlank(req.taskClassCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "책무구분은 필수선택 항목입니다");
        }
        if (isBlank(req.taskTypeCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "책무유형은 필수선택 항목입니다");
        }
        if (isBlank(req.taskName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "책무는 필수입력 항목입니다");
        }
        if (req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용시작일은 필수선택 항목입니다");
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    /** 체크박스 값: null은 false (AS-IS Boolean 필드) */
    private static String yn(String v) {
        return "true".equals(v) ? "true" : "false";
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.toString();
    }
}
