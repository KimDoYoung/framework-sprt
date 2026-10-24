package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleCouncilRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleTaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.TaskDeleteReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChangeHistoryService;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleService;
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

/** N08 직책별 책무 등록(Tdm20_Tab_Role)의 쓰기·변경이력(DB 함수 f_create_tdmChangeHistory)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmRoleService.class, TdmChangeHistoryService.class, JacksonAutoConfiguration.class})
class TdmRoleDbTest {

    @Autowired TdmRoleService service;
    @Autowired TdmChangeHistoryService historyService;
    @Autowired JdbcTemplate jdbc;

    /** prod_s1 (책무 데이터가 있는 고객사) */
    private static final long COMPANY = 202601209259551L;
    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-1L).companyId(COMPANY).name("N08시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();
    private static final LocalDate TODAY = LocalDate.now();

    private long ceoRoleId() {
        List<RoleRes> ceos = service.search(ADMIN, TODAY, true, "", "C");
        assertThat(ceos).isNotEmpty();
        return ceos.get(0).roleId();
    }

    @Test
    void 목록은_전체보기와_직책그룹으로_거른다() {
        List<RoleRes> all = service.search(ADMIN, TODAY, true, "", null);
        List<RoleRes> now = service.search(ADMIN, TODAY, false, "", null);
        assertThat(now.size()).isLessThanOrEqualTo(all.size());
        assertThat(service.search(ADMIN, TODAY, true, "", "C")).allMatch(r -> "C".equals(r.roleType()));
        assertThat(service.search(ADMIN, TODAY, true, "존재하지않는글자zzzz", null)).isEmpty();
        assertThat(service.search(OTHER, TODAY, true, "", null)).doesNotContainAnyElementsOf(all);
    }

    @Test
    void 직책은_등록하고_사유와_함께_고치고_지운다() {
        long ceo = ceoRoleId();
        // 검사 문구
        assertThatThrownBy(() -> service.save(ADMIN, new RoleSaveReq(null, "", "A", null, "개요", TODAY, null, ceo, null))).hasMessageContaining("직책는 필수입력 항목입니다");
        assertThatThrownBy(() -> service.save(ADMIN, new RoleSaveReq(null, "N08", "E", null, "개요", TODAY, null, ceo, null))).hasMessageContaining("기타그룹명은 필수입력 항목입니다");
        assertThatThrownBy(() -> service.save(ADMIN, new RoleSaveReq(null, "N08", "A", null, "개요", TODAY, null, null, null))).hasMessageContaining("보고CEO는 필수선택 항목입니다");

        // 등록: 이력 없음
        RoleRes created = service.save(ADMIN, new RoleSaveReq(null, "N08시험직책", "E", "시험그룹", "시험 개요", TODAY, null, ceo, null));
        long id = created.roleId();
        assertThat(created.roleTypeEtcName()).isEqualTo("시험그룹");
        assertThat(historyService.search(ADMIN, "tdm20_role", id, null, null)).isEmpty();

        // 변경 없음 / 사유 없음
        RoleSaveReq same = new RoleSaveReq(id, "N08시험직책", "E", "시험그룹", "시험 개요", TODAY, null, ceo, "사유");
        assertThatThrownBy(() -> service.save(ADMIN, same)).hasMessageContaining("변경사항이 없습니다");
        RoleSaveReq edited = new RoleSaveReq(id, "N08시험직책2", "A", "무시됨", "시험 개요", TODAY, TODAY.plusYears(1), ceo, null);
        assertThatThrownBy(() -> service.save(ADMIN, edited)).hasMessageContaining("변경사유 미입력");
        RoleRes updated = service.save(ADMIN, new RoleSaveReq(id, "N08시험직책2", "A", "무시됨", "시험 개요", TODAY, TODAY.plusYears(1), ceo, "고침"));
        assertThat(updated.roleName()).isEqualTo("N08시험직책2");
        assertThat(updated.roleTypeEtcName()).isNull();   // 기타그룹이 아니면 기타그룹명은 비운다
        var history = historyService.search(ADMIN, "tdm20_role", id, null, null);
        assertThat(history).isNotEmpty();
        assertThat(historyService.searchDetails(ADMIN, history.get(0).changeHistoryId())).extracting("windowItemName").contains("직책명", "직책그룹", "기타그룹명", "사용종료일");

        // 다른 회사는 못 건드린다
        assertThatThrownBy(() -> service.save(OTHER, new RoleSaveReq(id, "남", "A", null, "x", TODAY, null, ceo, "남"))).hasMessageContaining("권한");

        // 보고CEO로 쓰인 직책은 직책그룹을 바꿀 수 없다 (C가 아닌 직책이 보고CEO로 쓰이면 AS-IS 검사에 걸린다)
        RoleRes sub = service.save(ADMIN, new RoleSaveReq(null, "N08하위", "A", null, "개요", TODAY, null, id, null));
        assertThat(sub.ceoRoleName()).isEqualTo("N08시험직책2");
        assertThatThrownBy(() -> service.save(ADMIN, new RoleSaveReq(id, "N08시험직책2", "B", null, "시험 개요", TODAY, TODAY.plusYears(1), ceo, "바꿈")))
                .hasMessageContaining("보고CEO로 등록되어있는 직책은 직책그룹 수정이 불가합니다");

        // 삭제: 사유 필수, 삭제이력 생성
        assertThatThrownBy(() -> service.delete(ADMIN, new TaskDeleteReq(List.of(id), " "))).hasMessageContaining("사유 미입력");
        assertThat(service.delete(ADMIN, new TaskDeleteReq(List.of(sub.roleId(), id), "시험 삭제"))).isEqualTo(2);
        assertThat(historyService.search(ADMIN, "tdm20_role", id, null, null)).extracting("changeType").contains("삭제");
    }

    @Test
    void 보고CEO를_바꾸고_연결책무_회의체_부서를_넣고_뺀다() {
        long ceo = ceoRoleId();
        long id = service.save(ADMIN, new RoleSaveReq(null, "N08연결시험", "A", null, "개요", TODAY, null, ceo, null)).roleId();
        assertThat(service.updateCeo(ADMIN, id, ceo).ceoRoleId()).isEqualTo(ceo);
        assertThatThrownBy(() -> service.updateCeo(OTHER, id, ceo)).hasMessageContaining("권한");

        // 연결책무
        long taskId = jdbc.queryForObject("select tdm10_task_id from tdm10_task where tdm10_company_id = ? limit 1", Long.class, COMPANY);
        assertThat(service.saveTasks(ADMIN, id, List.of(new RoleTaskRes(-1L, id, taskId, null, null, null, null, null)))).isEqualTo(1);
        List<RoleTaskRes> tasks = service.searchTasks(ADMIN, id);
        assertThat(tasks).hasSize(1);
        assertThat(service.search(ADMIN, TODAY, true, "N08연결시험", null).get(0).roleRelateTaskCnt()).isEqualTo("1건");
        assertThatThrownBy(() -> service.saveTasks(OTHER, id, List.of())).hasMessageContaining("권한");
        assertThat(service.deleteTasks(ADMIN, id, List.of(tasks.get(0).roleRelateTaskId()))).isEqualTo(1);

        // 연결회의체 (역할·시작일 필수)
        long cnclId = jdbc.queryForObject("select tdm05_cncl_id from tdm05_cncl where tdm05_company_id = ? limit 1", Long.class, COMPANY);
        assertThatThrownBy(() -> service.saveCouncils(ADMIN, id, List.of(new RoleCouncilRes(-1L, id, cnclId, null, null, null, TODAY, null)))).hasMessageContaining("역할은 필수선택 항목입니다");
        assertThat(service.saveCouncils(ADMIN, id, List.of(new RoleCouncilRes(-1L, id, cnclId, null, "MB", null, TODAY, null)))).isEqualTo(1);
        RoleCouncilRes cncl = service.searchCouncils(ADMIN, id).get(0);
        assertThat(cncl.memberTypeName()).isNotBlank();
        assertThat(service.saveCouncils(ADMIN, id, List.of(new RoleCouncilRes(cncl.roleRelateCnclId(), id, cnclId, null, "CM", null, TODAY, TODAY.plusDays(5))))).isEqualTo(1);
        assertThat(service.searchCouncils(ADMIN, id).get(0).memberType()).isEqualTo("CM");
        assertThat(service.deleteCouncils(ADMIN, id, List.of(cncl.roleRelateCnclId()))).isEqualTo(1);

        // 연결부서
        long orgId = jdbc.queryForObject("select org00_org_id from getOrg(?, current_date) limit 1", Long.class, COMPANY);
        assertThat(service.saveOrgs(ADMIN, id, TODAY, List.of(new RoleOrgRes(-1L, id, orgId, null)))).isEqualTo(1);
        List<RoleOrgRes> orgs = service.searchOrgs(ADMIN, id, TODAY);
        assertThat(orgs).hasSize(1);
        assertThat(service.deleteOrgs(ADMIN, id, List.of(orgs.get(0).roleRelateOrgId()))).isEqualTo(1);
        assertThatThrownBy(() -> service.saveOrgs(ADMIN, id, TODAY, List.of(new RoleOrgRes(-1L, id, -999L, null)))).hasMessageContaining("찾을 수 없");
    }

    @Test
    void 임원별_직책배정에_쓰인_직책은_삭제할_수_없다() {
        List<Long> used = jdbc.queryForList("select distinct tdm30_role_id from tdm30_role_allc join tdm20_role on tdm20_role_id = tdm30_role_id where tdm20_company_id = ?", Long.class, COMPANY);
        if (used.isEmpty()) {
            return;   // 이 회사에는 배정된 직책이 없다
        }
        assertThat(service.countUse(ADMIN, List.of(used.get(0)))).isPositive();
        assertThatThrownBy(() -> service.delete(ADMIN, new TaskDeleteReq(List.of(used.get(0)), "시험"))).hasMessageContaining("연결되어 있는 직책입니다");
    }
}
