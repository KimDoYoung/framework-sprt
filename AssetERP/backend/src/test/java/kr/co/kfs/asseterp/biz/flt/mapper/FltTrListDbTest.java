package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookListRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprDocRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpApprRes;
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
        // AS-IS selectByTrList와의 건수 대조는 mapper-run --compare로 한다(cmp08.sh). 여기서는 DB 사본에 기대지 않는 관계만 본다
        List<TrListRes> all = trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "");
        assertThat(all).isNotEmpty();
        assertThat(all.get(0).accountNo()).contains("(");
        assertThat(all).extracting(TrListRes::trId).doesNotHaveDuplicates();
        List<TrListRes> real = trService.searchList(user, "2025-01-01", "2026-10-21", false, "%", "%", "");
        assertThat(real).isNotEmpty().hasSizeLessThanOrEqualTo(all.size()).allMatch(r -> r.trDate() != null);
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "삼성")).hasSizeLessThanOrEqualTo(all.size());
        List<TrListRes> out = trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "2%", "");
        assertThat(out).filteredOn(r -> r.trAmt() != null && r.trAmt() != 0L).allMatch(r -> r.trAmt() < 0);  // 출고는 음수
        List<TrListRes> in = trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "1%", "");
        assertThat(out.size() + in.size()).isEqualTo(all.size());   // 입고(1)·출고(2)로 나뉜다
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
        // J03: 같은 SQL에 personId 생략(회사 전체)·unApprYn "false"
        List<TrListRes> all = trService.searchListAdmin(user, null, "2025-01-01", "2026-10-21", true, "%", "%", "");
        assertThat(all).isNotEmpty();
        assertThat(all.get(0).personOrgName()).contains("(");
        List<TrListRes> one = trService.searchListAdmin(user, 29049L, "2025-01-01", "2026-10-21", true, "%", "%", "");
        assertThat(one).isNotEmpty().hasSizeLessThanOrEqualTo(all.size());
        assertThat(all).extracting(TrListRes::trId).containsAll(one.stream().map(TrListRes::trId).toList());
        // 개인용(unApprYn "true")은 미신청 사전신고 행까지 나와 같은 사원도 준감인용보다 적지 않다
        assertThat(trService.searchList(user, "2025-01-01", "2026-10-21", true, "%", "%", "")).hasSizeGreaterThanOrEqualTo(one.size());
        assertThat(headerCount(trService.downloadListAdmin(user, null, "2025-01-01", "2026-10-21", false, null, null, ""))).isEqualTo(15);
        assertThat(headerCount(trService.downloadListAdmin(user, null, "2025-01-01", "2026-10-21", true, null, null, ""))).isEqualTo(11);
    }

    @Test
    void 보유내역은_기준일_본인_것이_읽히고_엑셀로_나온다() throws IOException {
        // AS-IS selectByBookList와의 건수 대조는 mapper-run --compare로 한다. 여기서는 관계만
        List<BookListRes> list = bookService.searchList(user, "2025-12-22", "");
        assertThat(list).isNotEmpty();
        assertThat(list.get(0).accountNo()).contains("(");
        assertThat(list).extracting(BookListRes::bookId).doesNotHaveDuplicates();
        assertThat(bookService.searchList(user, "2025-12-22", "삼성")).hasSizeLessThanOrEqualTo(list.size());
        assertThat(bookService.searchList(other, "2025-12-22", "")).isEmpty();
        assertThat(headerCount(bookService.downloadList(user, "2025-12-22", ""))).isEqualTo(10);
    }

    @Test
    void 위반내역은_전체와_사원_하나가_읽히고_엑셀로_나온다() throws IOException {
        // I10: 원본 조각을 그대로 옮겼다(대조 불가 — 05 작업방법 I10). 사원 하나는 전체보다 많지 않다
        List<ViolateRes> all = trService.searchViolate(user, "2025-12-22", null);
        assertThat(all).isNotEmpty();
        assertThat(all).extracting(ViolateRes::trId).doesNotHaveDuplicates();
        List<ViolateRes> mine = trService.searchViolate(user, "2025-12-22", 29049L);
        assertThat(mine).isNotEmpty().hasSizeLessThanOrEqualTo(all.size()).allMatch(r -> r.personName() != null && r.checkName() != null);
        assertThat(headerCount(trService.downloadViolate(user, "2025-12-22", 29049L))).isEqualTo(9);
    }

    /** J06 정기보고현황 — 2026-09-30 기준 회사 전체와 미보고건만(전체보다 많지 않고 완료가 없다), 사원의 상신문서, 삭제는 테스트 트랜잭션이라 롤백 */
    @Test
    void 정기보고현황은_전체와_미보고건만_읽히고_상신문서_삭제는_목록에서_빠진다() {
        List<EmpApprRes> all = trService.searchEmpApprs(user, "2026-09-30", false, null);
        assertThat(all).isNotEmpty();
        assertThat(trService.searchEmpApprs(user, "2026-09-30", true, null)).hasSizeLessThanOrEqualTo(all.size())
                .noneMatch(r -> "완료".equals(r.checkApprName()));
        assertThat(trService.searchEmpApprs(user, "2026-09-30", false, "zzzz없는이름")).isEmpty();

        // 상신문서가 있는 사원(2026년, flt14_relate_appr)으로 목록·삭제를 본다 — 하나 지우면 하나 준다
        List<EmpApprDocRes> docs = trService.searchEmpApprDocs(user, 202204180108329L, "2026-01-01", "2026-12-31");
        assertThat(docs).isNotEmpty().allMatch(d -> d.apprStatusName() != null && d.apprTitle() != null);
        trService.deleteAppr(user, docs.get(0).apprId());
        assertThat(trService.searchEmpApprDocs(user, 202204180108329L, "2026-01-01", "2026-12-31")).hasSize(docs.size() - 1);
    }

    private static int headerCount(byte[] xlsx) throws IOException {
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
            return wb.getSheetAt(0).getRow(0).getLastCellNum();
        }
    }
}
