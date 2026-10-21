package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookListRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrListRes;
import kr.co.kfs.asseterp.biz.flt.dto.ViolateRes;
import kr.co.kfs.asseterp.biz.flt.service.FltBookService;
import kr.co.kfs.asseterp.biz.flt.service.FltTrService;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** I08 매매내역조회·I09 보유내역조회(읽기 전용)를 asseterpdb에서 돌린다. 실제 사원(회사 28000, 사원 29049) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltTrService.class, FltBookService.class})
class FltTrListDbTest {

    @Autowired FltTrService trService;
    @Autowired FltBookService bookService;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 매매내역은_본인_것만_읽히고_사전신고_포함을_끄면_실거래만_나온다() {
        // 대조: AS-IS selectByTrList(협의승인 열을 NULL로 본 것) 행 수 117(포함)·85(미포함)·91(삼성)·34(출고)·83(입고), cmp08.sh
        List<TrListRes> all = trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "");
        assertThat(all).hasSize(117);
        assertThat(all.get(0).accountNo()).contains("(");
        assertThat(all).extracting(TrListRes::trId).doesNotHaveDuplicates();
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", false, "%", "%", "")).hasSize(85)
                .allMatch(r -> r.trDate() != null);
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "삼성")).hasSize(91);
        List<TrListRes> out = trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "2%", "");
        assertThat(out).hasSize(34);
        assertThat(out).filteredOn(r -> r.trAmt() != null && r.trAmt() != 0L).allMatch(r -> r.trAmt() < 0);  // 출고는 음수
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "1%", "")).hasSize(83);
        // 다른 사원으로는 본인 거래가 안 보이고, trType을 주면 그 구분만 나온다
        assertThat(trService.searchList(other, "2025-01-01", "2026-10-21", true, null, null, "")).isEmpty();
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "10I", null, ""))
                .isNotEmpty().allMatch(r -> "매수".equals(r.trTypeName()));
    }

    @Test
    void 매매내역_엑셀은_사전신고_열이_토글된다() throws IOException {
        assertThat(headerCount(trService.downloadList(user, "2025-01-01", "2026-10-21", true, null, null, ""))).isEqualTo(15);
        assertThat(headerCount(trService.downloadList(user, "2025-01-01", "2026-10-21", false, null, null, ""))).isEqualTo(11);
    }

    @Test
    void 준감인_매매내역은_전체와_사원_하나가_읽히고_엑셀이_두_종류로_나온다() throws IOException {
        // J03: 같은 SQL에 personId 생략(회사 전체)·unApprYn "false". 기대 행 수는 같은 조건을 SQL로 따로 센 값(전체 149·사원 29049 101, yunhee sql)
        List<TrListRes> all = trService.searchListAdmin(user, null, "2025-01-01", "2026-10-21", true, "%", "%", "");
        assertThat(all).hasSize(149);
        assertThat(all.get(0).personOrgName()).contains("(");
        assertThat(trService.searchListAdmin(user, 29049L, "2025-01-01", "2026-10-21", true, "%", "%", "")).hasSize(101);
        // 개인용(unApprYn "true")은 미신청 사전신고 행까지 나와 같은 사원도 준감인용(101)보다 많다 (SQL로 센 값 114)
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "")).hasSize(114);
        assertThat(headerCount(trService.downloadListAdmin(user, null, "2025-01-01", "2026-10-21", false, null, null, ""))).isEqualTo(15);
        assertThat(headerCount(trService.downloadListAdmin(user, null, "2025-01-01", "2026-10-21", true, null, null, ""))).isEqualTo(11);
    }

    @Test
    void 보유내역은_기준일_본인_것이_읽히고_엑셀로_나온다() throws IOException {
        // 대조: AS-IS selectByBookList 2025-12-22 → 50행, 검색 '삼성' → 27행 (mapper-run --compare)
        List<BookListRes> list = bookService.searchList(user, "2025-12-22", "");
        assertThat(list).hasSize(50);
        assertThat(list.get(0).accountNo()).contains("(");
        assertThat(list).extracting(BookListRes::bookId).doesNotHaveDuplicates();
        assertThat(bookService.searchList(user, "2025-12-22", "삼성")).hasSize(27);
        assertThat(bookService.searchList(other, "2025-12-22", "")).isEmpty();
        assertThat(headerCount(bookService.downloadList(user, "2025-12-22", ""))).isEqualTo(10);
    }

    @Test
    void 위반내역은_전체와_사원_하나가_읽히고_엑셀로_나온다() throws IOException {
        // I10: 원본 조각을 그대로 옮겼고(대조 불가 — 05 작업방법 I10), 같은 SQL을 mapper-run으로 돌려 전체 70행·사원 29049 16행
        List<ViolateRes> all = trService.searchViolate(user, "2025-12-22", null);
        assertThat(all).hasSize(70);
        assertThat(all).extracting(ViolateRes::trId).doesNotHaveDuplicates();
        List<ViolateRes> mine = trService.searchViolate(user, "2025-12-22", 29049L);
        assertThat(mine).hasSize(16).allMatch(r -> r.personName() != null && r.checkName() != null);
        assertThat(headerCount(trService.downloadViolate(user, "2025-12-22", 29049L))).isEqualTo(9);
    }

    private static int headerCount(byte[] xlsx) throws IOException {
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
            return wb.getSheetAt(0).getRow(0).getLastCellNum();
        }
    }
}
