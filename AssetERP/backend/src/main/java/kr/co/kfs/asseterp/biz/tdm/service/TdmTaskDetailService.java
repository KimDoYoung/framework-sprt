package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmTaskDetailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** 책무 세부내용 (AS-IS server/tdm/Tdm12_TaskRelateDetail) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmTaskDetailService {

    private static final String TABLE = "tdm12_task_relate_detail";

    private final TdmTaskDetailMapper mapper;
    private final TdmChangeHistoryService historyService;

    /** AS-IS Tdm12_TaskRelateDetail.selectByTaskId */
    public List<TaskDetailRes> search(UserPrincipal user, Long taskId) {
        return mapper.selectByTaskId(user.getCompanyId(), taskId);
    }

    /** AS-IS Tdm12_TaskRelateDetail.countByTaskDetailId: 사용 건수 합 */
    public int countUse(List<Long> detailIds) {
        int sum = 0;
        for (Long id : detailIds) {
            sum += mapper.countByTaskDetailId(id);
        }
        return sum;
    }

    /**
     * AS-IS Tdm12_TaskRelateDetail.update: 기존 행을 고쳤으면 변경사유와 함께 G-UPDATE 변경이력(고친 열만, 행마다 targetKeyId)을
     * 먼저 만들고 저장. 신규 행(ID null/≤0)만 저장할 때는 사유가 필요 없다. 저장한 행을 요청 순서로 돌려준다.
     */
    @Transactional
    public List<TaskDetailRes> save(UserPrincipal user, TaskDetailSaveReq req) {
        List<TaskDetailRow> rows = req.rows() == null ? List.of() : req.rows();
        for (TaskDetailRow row : rows) {
            if (row.content() == null || row.content().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "책무 세부내용을 입력하세요");
            }
            if (row.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순서를 입력하세요");
            }
            checkCompany(user, row.taskId());
        }

        // 변경이력: 기존 행의 바뀐 열만 (AS-IS는 사용자가 고친 열)
        List<List<Map<String, String>>> modiRowList = new ArrayList<>();
        for (TaskDetailRow row : rows) {
            if (row.taskRelateDetailId() == null || row.taskRelateDetailId() <= 0) {
                continue;
            }
            TaskDetailRes origin = mapper.selectById(row.taskRelateDetailId());
            if (origin == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            String key = row.taskRelateDetailId().toString();
            List<Map<String, String>> cols = new ArrayList<>();
            if (!Objects.equals(origin.content(), row.content())) {
                cols.add(col("책무세부내용", "tdm12_content", row.content(), key));
            }
            if (!Objects.equals(origin.seq(), row.seq())) {
                cols.add(col("조회순서", "tdm12_seq", row.seq().toString(), key));
            }
            if (!Objects.equals(yn(origin.useYn()), yn(row.useYn()))) {
                cols.add(col("사용여부", "tdm12_use_yn", yn(row.useYn()), key));
            }
            if (!cols.isEmpty()) {
                modiRowList.add(cols);
            }
        }
        if (!modiRowList.isEmpty()) {
            if (req.reason() == null || req.reason().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "저장이 취소되었습니다 (사유 미입력)");
            }
            Map<String, Object> history = historyService.newHistory(user, "G-UPDATE", TABLE, req.reason());
            history.put("modiColumnList", modiRowList);
            historyService.insertModifyHistory(history);
        }

        List<Long> ids = new ArrayList<>();
        for (TaskDetailRow row : rows) {
            TaskDetailRow normalized = new TaskDetailRow(row.taskRelateDetailId(), row.taskId(), row.content(), row.seq(), yn(row.useYn()));
            if (row.taskRelateDetailId() == null || row.taskRelateDetailId() <= 0) {
                Long newId = mapper.selectNextId();
                mapper.insertDetail(newId, normalized, user.getName());
                ids.add(newId);
            } else {
                if (mapper.updateDetail(normalized, user.getName()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                ids.add(row.taskRelateDetailId());
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm12_TaskRelateDetail.delete: 사용이력이 있으면 중단, 삭제이력을 만든 뒤 삭제 */
    @Transactional
    public int delete(UserPrincipal user, TaskDeleteReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
        if (req.reason() == null || req.reason().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "삭제가 취소되었습니다 (사유 미입력)");
        }
        for (Long id : req.ids()) {
            TaskDetailRes origin = mapper.selectById(id);
            if (origin != null) {
                checkCompany(user, origin.taskId());
            }
            if (mapper.countByTaskDetailId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용이력이 있는 책무 세부내용은 삭제 할 수 없습니다");
            }
            historyService.insertDeleteHistory(user, TABLE, id, req.reason());
        }
        return mapper.deleteDetails(req.ids());
    }

    /** 책무가 이미 저장돼 있으면 로그인 회사 것이어야 한다 (편집창에서 저장 전 책무에 세부내용을 먼저 올리는 AS-IS 흐름은 허용) */
    private void checkCompany(UserPrincipal user, Long taskId) {
        if (taskId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = mapper.selectTaskCompany(taskId);
        if (companyId != null && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
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
