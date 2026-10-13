package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupMemberSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeGroupSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeGroupService;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeKindService;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** A13 시스템 공통코드 관리(코드구분·코드·코드 그룹)를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCodeKindService.class, SysCodeService.class, SysCodeGroupService.class})
class CodeAdminDbTest {

    @Autowired SysCodeKindService kindService;
    @Autowired SysCodeService codeService;
    @Autowired SysCodeGroupService groupService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal customer = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private CodeKindRes newKind(String sysYn) {
        return kindService.updateCodeKinds(sysAdmin, List.of(new CodeKindSaveReq(null, "A13Test", "A13시험", sysYn, "메모"))).get(0);
    }

    @Test
    void 코드구분_조회는_전체_또는_이름_코드_포함_검색() {
        int total = jdbc.queryForObject("select count(*) from sys08_code_kind", Integer.class);
        assertThat(kindService.searchCodeKinds(sysAdmin, "", "%")).hasSize(total);
        // sysYn이 비면 'false'만 (AS-IS 서버 기본값)
        int notSystem = jdbc.queryForObject("select count(*) from sys08_code_kind where sys08_sys_yn = 'false'", Integer.class);
        assertThat(kindService.searchCodeKinds(sysAdmin, null, null)).hasSize(notSystem);
        // 코드구분 대소문자 무시
        assertThat(kindService.searchCodeKinds(sysAdmin, "monthscode", "%")).extracting(CodeKindRes::kindCd).contains("MonthsCode");
    }

    @Test
    void 코드구분_등록_수정_삭제와_검사() {
        CodeKindRes kind = newKind("true");
        assertThat(kind.codeKindId()).isPositive();
        assertThat(kind.sysYn()).isEqualTo("true");
        CodeKindRes changed = kindService.updateCodeKinds(sysAdmin,
                List.of(new CodeKindSaveReq(kind.codeKindId(), "A13Test", "수정됨", "false", null))).get(0);
        assertThat(changed.kindNm()).isEqualTo("수정됨");
        assertThat(changed.sysYn()).isEqualTo("false");
        assertThat(kindService.deleteCodeKinds(sysAdmin, List.of(kind.codeKindId()))).isEqualTo(1);
        assertThatThrownBy(() -> kindService.updateCodeKinds(sysAdmin, List.of(new CodeKindSaveReq(null, " ", "x", "false", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("코드구분");
        assertThatThrownBy(() -> kindService.updateCodeKinds(sysAdmin, List.of(new CodeKindSaveReq(null, "x", null, "false", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("코드구분명");
    }

    @Test
    void 코드구분_API는_sys_admin만() {
        assertThatThrownBy(() -> kindService.searchCodeKinds(customer, "", "%")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> groupService.searchGroups(customer, 1L)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 시스템_코드구분의_코드는_회사_0으로_조회하고_등록_수정_삭제() {
        CodeKindRes kind = newKind("true");
        // 시스템 코드구분이면 어느 회사로 물어도 회사 0 (SQL의 CASE)
        assertThat(codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 28000L, "")).isEmpty();
        CodeAdminSaveReq req = new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "T01", "시험코드", "1", "false",
                LocalDate.of(1910, 1, 1), null, "상세");
        CodeAdminRes saved = codeService.updateCodes(sysAdmin, List.of(req)).get(0);
        assertThat(saved.codeId()).isPositive();
        assertThat(saved.companyId()).isZero();
        assertThat(saved.applyDate()).isEqualTo(LocalDate.of(1910, 1, 1));
        assertThat(codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 28000L, "시험")).hasSize(1);
        assertThat(codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 0L, "없는말")).isEmpty();

        // 같은 코드의 다음 시작일 전날 = lastDate
        codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "T01", "시험코드2", "2",
                "true", LocalDate.of(2020, 3, 1), LocalDate.of(2030, 1, 1), null)));
        List<CodeAdminRes> list = codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 0L, "");
        assertThat(list).hasSize(2);
        assertThat(list.get(0).seq()).isEqualTo("1");
        assertThat(list.get(0).lastDate()).isEqualTo(LocalDate.of(2020, 2, 29));
        assertThat(list.get(1).closeYn()).isEqualTo("true");

        CodeAdminRes changed = codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(saved.codeId(),
                kind.codeKindId(), 0L, "T01", "바뀜", "1", "false", LocalDate.of(1910, 1, 1), null, "상세"))).get(0);
        assertThat(changed.name()).isEqualTo("바뀜");
        assertThat(codeService.deleteCodes(sysAdmin, 0L, List.of(saved.codeId(), list.get(1).codeId()))).isEqualTo(2);
    }

    @Test
    void 시스템이_아닌_코드구분의_코드는_로그인_회사로_조회_저장_삭제는_회사_범위() {
        CodeKindRes kind = newKind("false");
        CodeAdminSaveReq req = new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "C01", "고객코드", "1", "false",
                LocalDate.of(1910, 1, 1), null, null);
        // 고객사 관리자는 요청의 회사를 무시하고 자기 회사로 저장한다
        CodeAdminRes mine = codeService.updateCodes(customer, List.of(req)).get(0);
        assertThat(mine.companyId()).isEqualTo(28000L);
        assertThat(codeService.searchCodesByKindId(customer, kind.codeKindId(), 0L, "")).hasSize(1);
        assertThat(codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 0L, "")).isEmpty();
        assertThat(codeService.searchCodesByKindId(sysAdmin, kind.codeKindId(), 28000L, "")).hasSize(1);
        // 다른 회사의 행은 지워지지 않는다
        assertThat(codeService.deleteCodes(sysAdmin, 0L, List.of(mine.codeId()))).isZero();
        assertThat(codeService.deleteCodes(customer, 0L, List.of(mine.codeId()))).isEqualTo(1);
    }

    @Test
    void 코드_검사() {
        CodeKindRes kind = newKind("true");
        LocalDate d = LocalDate.of(1910, 1, 1);
        assertThatThrownBy(() -> codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "",
                "n", null, "false", d, null, null)))).hasMessageContaining("코드를 입력");
        assertThatThrownBy(() -> codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L,
                "12345678901", "n", null, "false", d, null, null)))).hasMessageContaining("10자");
        assertThatThrownBy(() -> codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "x",
                "", null, "false", d, null, null)))).hasMessageContaining("코드명");
        assertThatThrownBy(() -> codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "x",
                "n", null, "false", null, null, null)))).hasMessageContaining("시작일자");
    }

    @Test
    void 코드_그룹_등록_이름변경_소속코드_삭제() {
        CodeKindRes kind = newKind("true");
        CodeAdminRes c1 = codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "G1", "하나",
                "1", "false", LocalDate.of(1910, 1, 1), null, null))).get(0);
        CodeAdminRes c2 = codeService.updateCodes(sysAdmin, List.of(new CodeAdminSaveReq(null, kind.codeKindId(), 0L, "G2", "둘",
                "2", "false", LocalDate.of(1910, 1, 1), null, null))).get(0);

        CodeGroupRes g = groupService.updateGroups(sysAdmin, List.of(new CodeGroupSaveReq(null, kind.codeKindId(), "GRP", "그룹설명"))).get(0);
        assertThat(g.codeGroupId()).isPositive();
        assertThat(g.codeId()).isZero();
        assertThat(groupService.searchGroups(sysAdmin, kind.codeKindId())).hasSize(1);

        assertThat(groupService.insertMembers(sysAdmin, List.of(
                new CodeGroupMemberSaveReq(kind.codeKindId(), "GRP", "그룹설명", c1.codeId()),
                new CodeGroupMemberSaveReq(kind.codeKindId(), "GRP", "그룹설명", c2.codeId())))).isEqualTo(2);
        List<CodeGroupRes> members = groupService.searchMembers(sysAdmin, "GRP", kind.codeKindId(), 0L);
        assertThat(members).extracting(CodeGroupRes::code).containsExactlyInAnyOrder("G1", "G2");
        assertThat(members).extracting(CodeGroupRes::name).containsExactlyInAnyOrder("하나", "둘");
        // 다른 회사로 보면 소속 코드가 없다(코드의 회사로 거른다)
        assertThat(groupService.searchMembers(sysAdmin, "GRP", kind.codeKindId(), 28000L)).isEmpty();
        // 그룹을 안 고르면(헤더 목록에는 소속 코드가 나오지 않는다)
        assertThat(groupService.searchGroups(sysAdmin, kind.codeKindId())).hasSize(1);

        // 이름을 바꾸면 소속 코드 행도 새 이름으로
        groupService.updateGroups(sysAdmin, List.of(new CodeGroupSaveReq(g.codeGroupId(), kind.codeKindId(), "GRP2", "새설명")));
        assertThat(groupService.searchMembers(sysAdmin, "GRP", kind.codeKindId(), 0L)).isEmpty();
        assertThat(groupService.searchMembers(sysAdmin, "GRP2", kind.codeKindId(), 0L)).hasSize(2);

        // 소속 코드 하나 삭제
        assertThat(groupService.deleteMembers(sysAdmin, List.of(members.get(0).codeGroupId()))).isEqualTo(1);
        assertThat(groupService.searchMembers(sysAdmin, "GRP2", kind.codeKindId(), 0L)).hasSize(1);

        // 그룹 삭제는 소속 코드까지
        assertThat(groupService.deleteGroups(sysAdmin, List.of(g.codeGroupId()))).isEqualTo(1);
        assertThat(groupService.searchGroups(sysAdmin, kind.codeKindId())).isEmpty();
        assertThat(groupService.searchMembers(sysAdmin, "GRP2", kind.codeKindId(), 0L)).isEmpty();
        assertThat(jdbc.queryForObject("select count(*) from sys13_code_group where sys13_code_kind_id = ?", Integer.class,
                kind.codeKindId())).isZero();
    }

    @Test
    void 코드_그룹_검사() {
        assertThatThrownBy(() -> groupService.updateGroups(sysAdmin, List.of(new CodeGroupSaveReq(null, 1L, "", "x"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("그룹코드");
        assertThatThrownBy(() -> groupService.updateGroups(sysAdmin, List.of(new CodeGroupSaveReq(null, 1L, "x", null))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("그룹설명");
    }
}
