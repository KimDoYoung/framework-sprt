package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeHistoryRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDetailSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskTypeRow;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChangeHistoryService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskDetailService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskTypeService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** N05 책무 등록(Tdm10_Tab_Task 외)의 쓰기·변경이력(DB 함수 f_create_tdmChangeHistory)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmTaskService.class, TdmTaskDetailService.class, TdmTaskTypeService.class, TdmChangeHistoryService.class, JacksonAutoConfiguration.class})
class TdmTaskDbTest {

    @Autowired TdmTaskService taskService;
    @Autowired TdmTaskDetailService detailService;
    @Autowired TdmTaskTypeService typeService;
    @Autowired TdmChangeHistoryService historyService;
    @Autowired JdbcTemplate jdbc;

    /** prod_s1 (책무 데이터가 있는 고객사) */
    private static final long COMPANY = 202601209259551L;
    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-1L).companyId(COMPANY).name("N05시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private String someTypeCode() {
        return jdbc.queryForObject("select tdm14_task_type_cd from tdm14_task_type where tdm14_company_id = ? order by 1 limit 1", String.class, COMPANY);
    }

    private TaskSaveReq newTask(String name) {
        String type = someTypeCode();
        return new TaskSaveReq(null, type.substring(0, 1), type, name, "true", "false", LocalDate.of(2026, 1, 1), null, null, null);
    }

    @Test
    void 책무는_등록하고_변경이력과_함께_고치고_사유와_함께_지운다() {
        TaskRes created = taskService.create(ADMIN, newTask("N05시험책무"));
        long id = created.taskId();
        assertThat(created.taskName()).isEqualTo("N05시험책무");
        assertThat(created.commonYn()).isEqualTo("true");
        assertThat(taskService.search(ADMIN, null, "%", true, "N05시험책무")).anyMatch(t -> t.taskId() == id);

        TaskSaveReq same = new TaskSaveReq(id, created.taskClassCode(), created.taskTypeCode(), created.taskName(), "true", "false", created.startDate(), null, null, "사유");
        assertThatThrownBy(() -> taskService.update(ADMIN, id, same)).hasMessageContaining("변경사항이 없습니다");

        TaskSaveReq changed = new TaskSaveReq(id, created.taskClassCode(), created.taskTypeCode(), "N05시험책무2", "false", "false", created.startDate(), null, null, null);
        assertThatThrownBy(() -> taskService.update(ADMIN, id, changed)).hasMessageContaining("변경사유");

        TaskRes updated = taskService.update(ADMIN, id, new TaskSaveReq(id, created.taskClassCode(), created.taskTypeCode(), "N05시험책무2", "false", "false", created.startDate(), null, null, "이름 고침"));
        assertThat(updated.taskName()).isEqualTo("N05시험책무2");
        assertThat(updated.commonYn()).isEqualTo("false");

        List<ChangeHistoryRes> history = historyService.search(ADMIN, "tdm10_task", id, null, null);
        assertThat(history).hasSize(1);
        assertThat(history.get(0).changeType()).isEqualTo("변경");
        assertThat(history.get(0).reason()).isEqualTo("이름 고침");
        assertThat(historyService.searchDetails(ADMIN, history.get(0).changeHistoryId()))
                .extracting("windowItemName").containsExactlyInAnyOrder("책무명", "공통책무여부");

        // 다른 회사는 못 건드린다
        assertThatThrownBy(() -> taskService.get(OTHER, id)).isInstanceOf(BusinessException.class);
        assertThat(taskService.delete(OTHER, new TaskDeleteReq(List.of(id), "남의 것"))).isZero();

        assertThatThrownBy(() -> taskService.delete(ADMIN, new TaskDeleteReq(List.of(id), " "))).hasMessageContaining("사유 미입력");
        assertThat(taskService.delete(ADMIN, new TaskDeleteReq(List.of(id), "시험 삭제"))).isEqualTo(1);
        assertThat(historyService.search(ADMIN, "tdm10_task", id, null, null)).extracting("changeType").contains("삭제");
        assertThat(taskService.search(ADMIN, null, "%", true, "N05시험책무")).noneMatch(t -> t.taskId() == id);
    }

    @Test
    void 책무를_복사하면_책무세부내용도_복사된다() {
        Long sourceId = jdbc.queryForObject("select tdm12_task_id from tdm12_task_relate_detail join tdm10_task on tdm10_task_id = tdm12_task_id where tdm10_company_id = ? limit 1", Long.class, COMPANY);
        TaskRes source = taskService.get(ADMIN, sourceId);
        int sourceCount = detailService.search(ADMIN, sourceId).size();
        assertThat(sourceCount).isPositive();

        Long newId = taskService.nextId();
        TaskRes copy = taskService.create(ADMIN, new TaskSaveReq(newId, source.taskClassCode(), source.taskTypeCode(), source.taskName() + "(복사)",
                source.commonYn(), source.ceoYn(), LocalDate.of(2026, 1, 1), null, sourceId, null));
        assertThat(copy.taskId()).isEqualTo(newId);
        assertThat(detailService.search(ADMIN, newId)).hasSize(sourceCount);
    }

    @Test
    void 사용이력이_있는_책무는_삭제할_수_없다() {
        Long used = jdbc.queryForObject("select tdm43_task_id from tdm43_manl join tdm10_task on tdm10_task_id = tdm43_task_id where tdm10_company_id = ? limit 1", Long.class, COMPANY);
        assertThat(taskService.countUse(List.of(used))).isPositive();
        assertThatThrownBy(() -> taskService.delete(ADMIN, new TaskDeleteReq(List.of(used), "시험")))
                .hasMessageContaining("사용이력이 있는 책무는 삭제 할 수 없습니다");
    }

    @Test
    void 책무_세부내용은_사유와_함께_고치고_지운다() {
        long taskId = taskService.create(ADMIN, newTask("N05세부시험")).taskId();

        // 신규 행만 저장할 때는 사유가 필요 없다
        List<TaskDetailRes> saved = detailService.save(ADMIN, new TaskDetailSaveReq(
                List.of(new TaskDetailRow(-1L, taskId, "세부1", 1L, "true"), new TaskDetailRow(-2L, taskId, "세부2", 2L, "true")), null));
        assertThat(saved).hasSize(2);
        assertThat(detailService.search(ADMIN, taskId)).extracting("content").containsExactly("세부1", "세부2");

        assertThatThrownBy(() -> detailService.save(ADMIN, new TaskDetailSaveReq(List.of(new TaskDetailRow(saved.get(0).taskRelateDetailId(), taskId, "", 1L, "true")), null)))
                .hasMessageContaining("책무 세부내용을 입력하세요");

        TaskDetailRow edited = new TaskDetailRow(saved.get(0).taskRelateDetailId(), taskId, "세부1수정", 1L, "false");
        assertThatThrownBy(() -> detailService.save(ADMIN, new TaskDetailSaveReq(List.of(edited), null))).hasMessageContaining("사유 미입력");
        List<TaskDetailRes> updated = detailService.save(ADMIN, new TaskDetailSaveReq(List.of(edited), "내용 고침"));
        assertThat(updated.get(0).content()).isEqualTo("세부1수정");
        assertThat(updated.get(0).useYn()).isEqualTo("false");

        List<ChangeHistoryRes> history = historyService.search(ADMIN, "tdm12_task_relate_detail", saved.get(0).taskRelateDetailId(), null, null);
        assertThat(history).isNotEmpty();
        assertThat(historyService.searchDetails(ADMIN, history.get(0).changeHistoryId())).extracting("windowItemName").contains("책무세부내용", "사용여부");

        assertThat(detailService.delete(ADMIN, new TaskDeleteReq(List.of(saved.get(1).taskRelateDetailId()), "시험 삭제"))).isEqualTo(1);
        assertThat(detailService.search(ADMIN, taskId)).hasSize(1);
    }

    @Test
    void 책무유형은_코드_중복과_연결을_검사한다() {
        String used = someTypeCode();
        TaskTypeRes usedRow = typeService.search(ADMIN, "%", false).stream().filter(t -> used.equals(t.taskTypeCode())).findFirst().orElseThrow();

        // 같은 코드를 새 행으로 → 중복
        assertThatThrownBy(() -> typeService.save(ADMIN, List.of(new TaskTypeRow(-1L, used, "중복", "true"))))
                .hasMessageContaining("사용중인 코드입니다(" + used + ")");

        TaskTypeRes created = typeService.save(ADMIN, List.of(new TaskTypeRow(-1L, "Z99", "N05시험유형", "true"))).get(0);
        assertThat(created.taskTypeCode()).isEqualTo("Z99");
        assertThat(typeService.search(ADMIN, "Z%", true)).anyMatch(t -> t.taskTypeId().equals(created.taskTypeId()));

        // 사용 중인 코드는 삭제할 수 없다 (책무에 연결된 유형이 있는 경우에만 검사됨)
        Long usedByTask = jdbc.queryForObject("select tdm14_task_type_id from tdm14_task_type t where tdm14_company_id = ? and exists (select 1 from tdm10_task where tdm10_company_id = tdm14_company_id and tdm10_task_type_cd = t.tdm14_task_type_cd) limit 1", Long.class, COMPANY);
        assertThatThrownBy(() -> typeService.delete(ADMIN, List.of(usedByTask))).hasMessageContaining("책무에 연결되어 있는 코드입니다");
        assertThat(usedRow.taskTypeId()).isNotNull();

        assertThat(typeService.delete(OTHER, List.of(created.taskTypeId()))).isZero();
        assertThat(typeService.delete(ADMIN, List.of(created.taskTypeId()))).isEqualTo(1);
    }
}
