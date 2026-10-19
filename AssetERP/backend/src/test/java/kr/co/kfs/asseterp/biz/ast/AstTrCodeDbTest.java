package kr.co.kfs.asseterp.biz.ast;

import kr.co.kfs.asseterp.biz.ast.dto.TrCodeInitReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowAddReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeWindowSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrCodeService;
import kr.co.kfs.asseterp.biz.ast.service.AstTrCodeWindowService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkRes;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchRes;
import kr.co.kfs.asseterp.biz.sys.service.SysBookmarkService;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E29(거래유형 등록)의 쓰기·화면 찾기·북마크를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AstTrCodeService.class, AstTrCodeWindowService.class, SysMenuSearchService.class, SysBookmarkService.class})
class AstTrCodeDbTest {

    @Autowired AstTrCodeService trCodes;
    @Autowired AstTrCodeWindowService windows;
    @Autowired SysMenuSearchService menus;
    @Autowired SysBookmarkService bookmarks;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();
    /** company 28000의 사원 (일반 사용자 경로: selectByText) */
    private final UserPrincipal emp = UserPrincipal.builder().userId(29037L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private static TrCodeSaveReq req(Long id, String code, String name, String rcvPay) {
        return new TrCodeSaveReq(id, code, name, rcvPay, "10", null, "false", "false", "true", "시험");
    }

    @Test
    void 거래코드_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = 0 and ast05_asset_type like '1' and coalesce(ast05_use_yn,'true') = 'true'", Integer.class);
        assertThat(trCodes.search(admin, "", true)).hasSize(all);

        TrCodeRes created = trCodes.update(admin, List.of(req(-1L, "ZZ9", "시험거래", "01"))).get(0);
        assertThat(created.trCodeId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.rcvPayName()).isNotBlank();  // f_cdnm
        assertThat(trCodes.search(admin, "zz9", true)).extracting(TrCodeRes::trCode).containsExactly("ZZ9");  // 코드||UPPER(이름) LIKE, 대소문자 무시
        assertThat(jdbc.queryForObject("select ast05_asset_type from ast05_tr_code where ast05_tr_code_id = ?", String.class, created.trCodeId())).isEqualTo("1");

        TrCodeRes updated = trCodes.update(admin, List.of(req(created.trCodeId(), "ZZ9", "시험거래2", "02"))).get(0);
        assertThat(updated.trName()).isEqualTo("시험거래2");
        assertThat(updated.rcvPayCode()).isEqualTo("02");

        // 같은 거래코드가 다른 행으로 있으면 막는다 (원본 update L66-92)
        assertThatThrownBy(() -> trCodes.update(admin, List.of(req(-2L, "ZZ9", "중복", "01")))).hasMessageContaining("동일한 거래코드가 존재합니다");
        // 필수 3종
        assertThatThrownBy(() -> trCodes.update(admin, List.of(req(null, "", "x", "01")))).hasMessageContaining("거래코드는 필수입력 항목입니다");
        assertThatThrownBy(() -> trCodes.update(admin, List.of(req(null, "ZZ8", "", "01")))).hasMessageContaining("거래명은 필수입력 항목입니다");
        assertThatThrownBy(() -> trCodes.update(admin, List.of(req(null, "ZZ8", "x", null)))).hasMessageContaining("수령/지급은 필수입력 항목입니다");

        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> trCodes.update(other, List.of(req(created.trCodeId(), "ZZ9", "침범", "01")))).isInstanceOf(BusinessException.class);
        assertThat(trCodes.delete(other, List.of(created.trCodeId()))).isZero();

        assertThat(trCodes.delete(admin, List.of(created.trCodeId()))).isEqualTo(1);
        assertThat(trCodes.delete(admin, List.of())).isZero();
        assertThat(trCodes.search(admin, "", true)).hasSize(all);
    }

    @Test
    void 기초데이터생성은_고객사의_같은_코드를_지우고_관리자_회사_것을_복사() {
        List<String> codes = trCodes.search(admin, "", true).stream().limit(2).map(TrCodeRes::trCode).toList();
        Long target = 28000L;
        int before = jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = ?", Integer.class, target);
        int existing = jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = ? and ast05_tr_cd in (?, ?)", Integer.class, target, codes.get(0), codes.get(1));

        assertThat(trCodes.insertInitData(admin, new TrCodeInitReq(List.of(target), codes))).isEqualTo(1);
        for (String code : codes) {
            assertThat(jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = ? and ast05_tr_cd = ?", Integer.class, target, code)).isEqualTo(1);
        }
        assertThat(jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = ?", Integer.class, target)).isEqualTo(before - existing + 2);
        // 선택한 코드가 없으면 아무 것도 안 하고 성공
        assertThat(trCodes.insertInitData(admin, new TrCodeInitReq(List.of(target), List.of()))).isEqualTo(1);
        // 관리자만
        assertThatThrownBy(() -> trCodes.insertInitData(other, new TrCodeInitReq(List.of(target), codes))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 화면별_거래유형_등록_지정_삭제() {
        Long company = 28000L;
        int regBefore = windows.searchAll(admin, company).size();
        TrCodeWindowRes added = windows.add(admin, new TrCodeWindowAddReq(company, "ZZ_Test_Window"));
        assertThat(added.trCode()).isNull();
        assertThat(added.companyId()).isEqualTo(company);
        assertThat(windows.searchAll(admin, company)).hasSize(regBefore + 1);
        assertThatThrownBy(() -> windows.add(admin, new TrCodeWindowAddReq(company, ""))).hasMessageContaining("매뉴를 선택해주세요");

        // 아직 지정 안 된 거래코드 = 그 회사 거래코드 전부
        int codeCount = jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = ?", Integer.class, company);
        List<TrCodeWindowRes> unassigned = windows.searchUnassigned(admin, company, "ZZ_Test_Window");
        assertThat(unassigned).hasSize(codeCount);

        // 왼쪽 그리드에 둘을 옮겨 저장 → 지정됨, 두 번 저장해도 같다
        List<TrCodeWindowSaveReq.Item> items = unassigned.stream().limit(2).map(r -> new TrCodeWindowSaveReq.Item(r.trCode(), null)).toList();
        TrCodeWindowSaveReq save = new TrCodeWindowSaveReq(company, "ZZ_Test_Window", items);
        assertThat(windows.save(admin, save)).isEqualTo(2);
        assertThat(windows.save(admin, save)).isEqualTo(2);
        assertThat(windows.searchAssigned(admin, company, "ZZ_Test_Window")).hasSize(2);
        assertThat(windows.searchUnassigned(admin, company, "ZZ_Test_Window")).hasSize(codeCount - 2);
        // 화면 등록 행(거래코드 없음)은 저장이 건드리지 않는다
        assertThat(windows.searchAll(admin, company)).hasSize(regBefore + 1);

        // 다른 회사는 자기 회사만 본다
        assertThat(windows.searchAssigned(other, company, "ZZ_Test_Window")).isEmpty();
        assertThat(windows.delete(other, company, List.of(added.trCodeWindowId()))).isZero();

        assertThat(windows.delete(admin, company, List.of(added.trCodeWindowId()))).isEqualTo(1);
        assertThat(windows.searchAll(admin, company)).hasSize(regBefore);
    }

    @Test
    void 화면찾기는_원본_SQL과_같은_행_수() {
        // 관리자 회사(0): selectByTextManager — 화면번호·경로명·Class명(·화면설명)
        List<MenuSearchRes> managerAll = menus.search(admin, null, "", true);
        assertThat(managerAll).hasSize(529);
        assertThat(managerAll.get(0).bookmark()).isNull();
        assertThat(managerAll.get(0).parentPathNm()).isNull();
        assertThat(menus.search(admin, null, "거래", false)).hasSize(24);
        assertThat(menus.search(admin, null, "거래", true)).hasSize(21);

        // 일반 사용자: selectByText — 원본 SQL 직접 실행값(사원 29037, 회사 28000): 전체(화면설명 포함) 221 / 계좌(화면명만) 5
        assertThat(menus.search(emp, null, "", false)).hasSize(221);
        List<MenuSearchRes> acct = menus.search(emp, null, "계좌", true);
        assertThat(acct).hasSize(5);
        assertThat(acct.get(0).parentPathNm()).isNotBlank();
    }

    @Test
    void 북마크_추가_삭제_그룹설정() {
        assertThat(bookmarks.search(emp)).isEmpty();
        Long menuId = menus.search(emp, null, "계좌", true).get(0).menuId();

        bookmarks.insertMenuId(emp, menuId);
        bookmarks.insertMenuId(emp, menuId);  // 이미 있으면 넣지 않는다 (insertMenuId L34-46)
        assertThat(jdbc.queryForObject("select count(*) from sys40_bookmark where sys40_person_id = 29037 and sys40_company_id = 28000", Integer.class)).isEqualTo(1);
        assertThat(menus.search(emp, null, "계좌", true).stream().filter(m -> m.menuId().equals(menuId)).findFirst().orElseThrow().bookmark()).isNotNull();

        List<BookmarkRes> list = bookmarks.search(emp);
        assertThat(list).hasSize(1);
        assertThat(list.get(0).menuNm()).isNotBlank();
        assertThat(bookmarks.update(emp, List.of(new BookmarkSaveReq(list.get(0).bookmarkId(), "시험그룹", "1")))).isEqualTo(1);
        assertThat(bookmarks.search(emp).get(0).parentTitleNm()).isEqualTo("시험그룹");
        // 다른 사용자 북마크는 못 고친다
        assertThat(bookmarks.update(other, List.of(new BookmarkSaveReq(list.get(0).bookmarkId(), "침범", "9")))).isZero();

        bookmarks.deleteMenuId(emp, menuId);
        assertThat(bookmarks.search(emp)).isEmpty();
        bookmarks.insertMenuId(emp, menuId);
        assertThat(bookmarks.deleteAll(emp)).isEqualTo(1);
    }
}
