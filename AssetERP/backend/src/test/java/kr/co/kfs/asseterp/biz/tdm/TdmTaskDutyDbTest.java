package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeHistoryRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDutySaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChangeHistoryService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmTaskDutyService;
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

/** N06 관리의무 등록(Tdm13_Tab_TaskDuty)의 쓰기·변경이력(DB 함수 f_create_tdmChangeHistory)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmTaskDutyService.class, TdmChangeHistoryService.class, JacksonAutoConfiguration.class})
class TdmTaskDutyDbTest {

    @Autowired TdmTaskDutyService service;
    @Autowired TdmChangeHistoryService historyService;
    @Autowired JdbcTemplate jdbc;

    /** prod_s1 (책무 데이터가 있는 고객사) */
    private static final long COMPANY = 202601209259551L;
    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-1L).companyId(COMPANY).name("N06시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    private TaskDutyDetailRes someDetail() {
        List<TaskDutyDetailRes> list = service.searchDetails(ADMIN, LocalDate.now(), "%", true, "");
        assertThat(list).isNotEmpty();
        return list.get(0);
    }

    @Test
    void 위쪽_목록은_전체보기가_아니면_기준일과_사용여부로_거른다() {
        List<TaskDutyDetailRes> all = service.searchDetails(ADMIN, LocalDate.now(), "%", true, "");
        List<TaskDutyDetailRes> now = service.searchDetails(ADMIN, LocalDate.now(), "%", false, "");
        assertThat(now.size()).isLessThanOrEqualTo(all.size());
        assertThat(now).allMatch(r -> "true".equals(r.useYn()));
        assertThat(service.searchDetails(ADMIN, LocalDate.now(), "%", true, "존재하지않는글자zzzz")).isEmpty();
    }

    @Test
    void 관리의무는_등록하고_사유와_함께_고치고_지운다() {
        TaskDutyDetailRes d = someDetail();
        int before = service.search(ADMIN, d.taskRelateDetailId()).size();

        // 신규 행만 저장할 때는 사유가 필요 없고 변경이력도 없다
        List<TaskDutyRes> saved = service.save(ADMIN, new TaskDutySaveReq(List.of(
                new TaskDutyRes(-1L, d.taskId(), d.taskRelateDetailId(), "N06관리의무1", 990L, "true"),
                new TaskDutyRes(-2L, d.taskId(), d.taskRelateDetailId(), "N06관리의무2", 991L, "true")), null));
        assertThat(saved).hasSize(2);
        assertThat(service.search(ADMIN, d.taskRelateDetailId())).hasSize(before + 2);
        long id1 = saved.get(0).taskRelateDutyId();
        assertThat(historyService.search(ADMIN, "tdm13_task_relate_duty", id1, null, null)).isEmpty();

        // 검사 문구
        assertThatThrownBy(() -> service.save(ADMIN, new TaskDutySaveReq(List.of(new TaskDutyRes(id1, d.taskId(), d.taskRelateDetailId(), "", 990L, "true")), null)))
                .hasMessageContaining("관리의무를 입력하세요");
        assertThatThrownBy(() -> service.save(ADMIN, new TaskDutySaveReq(List.of(new TaskDutyRes(id1, d.taskId(), d.taskRelateDetailId(), "x", null, "true")), null)))
                .hasMessageContaining("조회순서를 입력하세요");

        // 기존 행을 고치면 사유가 필요하다
        TaskDutyRes edited = new TaskDutyRes(id1, d.taskId(), d.taskRelateDetailId(), "N06관리의무1수정", 990L, "false");
        assertThatThrownBy(() -> service.save(ADMIN, new TaskDutySaveReq(List.of(edited), null))).hasMessageContaining("사유 미입력");
        List<TaskDutyRes> updated = service.save(ADMIN, new TaskDutySaveReq(List.of(edited), "내용 고침"));
        assertThat(updated.get(0).content()).isEqualTo("N06관리의무1수정");
        assertThat(updated.get(0).useYn()).isEqualTo("false");

        List<ChangeHistoryRes> history = historyService.search(ADMIN, "tdm13_task_relate_duty", id1, null, null);
        assertThat(history).isNotEmpty();
        assertThat(historyService.searchDetails(ADMIN, history.get(0).changeHistoryId())).extracting("windowItemName").contains("관리의무", "사용여부");

        // 다른 회사는 못 건드린다
        assertThatThrownBy(() -> service.save(OTHER, new TaskDutySaveReq(List.of(edited), "남"))).hasMessageContaining("권한");
        assertThat(service.search(OTHER, d.taskRelateDetailId())).isEmpty();

        // 삭제: 사유 필수, 삭제이력 생성
        assertThatThrownBy(() -> service.delete(ADMIN, new TaskDeleteReq(List.of(id1), " "))).hasMessageContaining("사유 미입력");
        assertThat(service.delete(ADMIN, new TaskDeleteReq(List.of(id1, saved.get(1).taskRelateDutyId()), "시험 삭제"))).isEqualTo(2);
        assertThat(service.search(ADMIN, d.taskRelateDetailId())).hasSize(before);
        assertThat(historyService.search(ADMIN, "tdm13_task_relate_duty", id1, null, null)).extracting("changeType").contains("삭제");
    }

    @Test
    void 사용이력이_있는_관리의무는_삭제할_수_없다() {
        Long used = jdbc.queryForObject("select tdm43_task_relate_duty_id from tdm43_manl join tdm13_task_relate_duty on tdm13_task_relate_duty_id = tdm43_task_relate_duty_id join tdm10_task on tdm10_task_id = tdm13_task_id where tdm10_company_id = ? limit 1", Long.class, COMPANY);
        assertThat(service.countUse(List.of(used))).isPositive();
        assertThatThrownBy(() -> service.delete(ADMIN, new TaskDeleteReq(List.of(used), "시험")))
                .hasMessageContaining("사용이력이 있는 관리의무를 삭제 할 수 없습니다");
    }
}
