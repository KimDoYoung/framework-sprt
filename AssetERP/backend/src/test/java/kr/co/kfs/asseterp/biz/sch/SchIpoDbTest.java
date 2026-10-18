package kr.co.kfs.asseterp.biz.sch;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemRes;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComItemService;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch14IpoMismatchSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoCorpService;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoItemMatchingService;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoMismatchService;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E20 공모주 일정등록(Sch10_Ipo·Sch12_IpoCorp·Sch14_IpoMismatch·Sch15_IpoItemMatching·Com50_Item)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SchIpoService.class, SchIpoCorpService.class, SchIpoItemMatchingService.class, SchIpoMismatchService.class, ComItemService.class})
class SchIpoDbTest {

    @Autowired SchIpoService ipo;
    @Autowired SchIpoCorpService corp;
    @Autowired SchIpoItemMatchingService matching;
    @Autowired SchIpoMismatchService mismatch;
    @Autowired ComItemService item;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ADMIN = UserPrincipal.builder().companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final UserPrincipal CUSTOMER = UserPrincipal.builder().companyId(11L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 일정_조회는_관리자_회사_조건기간_검색_시장구분() {
        int all = jdbc.queryForObject("select count(*) from sch10_ipo where sch10_company_id = 0 and sch10_demand_start_date between date '2000-01-01' and date '2099-12-31'"
                + " and sch10_demand_close_date <= date '2099-12-31'", Integer.class);
        List<Sch10IpoRes> rows = ipo.search("1", "2000-01-01", "2099-12-31", null, null);
        assertThat(rows).hasSize(all);
        assertThat(rows).allSatisfy(r -> assertThat(r.companyId()).isZero());
        assertThat(ipo.search("1", "2000-01-01", "2099-12-31", null, "2")).allSatisfy(r -> assertThat(r.marketCode()).isEqualTo("2"));
        assertThatThrownBy(() -> ipo.search("1", null, "2099-12-31", null, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 일정_등록_수정_삭제와_권한() {
        Sch10IpoSaveReq req = new Sch10IpoSaveReq(null, "2", "ZT시험종목", "ZT999", "2026-11-01", "2026-11-02", "2026-11-10", "2026-11-11",
                "2026-11-15", "2026-11-20", "1000~2000", 1500L, "주간사", "false");
        Sch10IpoRes created = ipo.update(ADMIN, List.of(req)).get(0);
        assertThat(created.ipoId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.marketName()).isNotNull();
        assertThat(created.demandStartDate()).isEqualTo("2026-11-01");
        assertThat(created.shareCount()).isZero();

        Sch10IpoRes updated = ipo.update(ADMIN, List.of(new Sch10IpoSaveReq(created.ipoId(), "3", "ZT시험종목2", "ZT999", null, null, null, null,
                null, null, null, null, null, "true"))).get(0);
        assertThat(updated.itemName()).isEqualTo("ZT시험종목2");
        assertThat(updated.marketCode()).isEqualTo("3");
        assertThat(updated.cancelYn()).isEqualTo("true");
        assertThat(updated.demandStartDate()).isNull();

        assertThatThrownBy(() -> ipo.update(CUSTOMER, List.of(req))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> ipo.update(ADMIN, List.of(new Sch10IpoSaveReq(null, "2", "", null, null, null, null, null, null, null, null, null, null, "false"))))
                .isInstanceOf(BusinessException.class);

        assertThat(ipo.delete(ADMIN, List.of(created.ipoId()))).isEqualTo(1);
        assertThat(ipo.delete(ADMIN, List.of())).isZero();
    }

    @Test
    void 엑셀업로드는_시장구분_종목명이_같으면_갱신_없으면_등록() throws IOException {
        int before = jdbc.queryForObject("select count(*) from sch10_ipo", Integer.class);
        assertThat(ipo.upload(ADMIN, excel("공모가A"))).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from sch10_ipo", Integer.class)).isEqualTo(before + 2);
        // 같은 파일을 다시 올리면 갱신만 한다
        assertThat(ipo.upload(ADMIN, excel("공모가B"))).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from sch10_ipo", Integer.class)).isEqualTo(before + 2);

        Sch10IpoRes zt = ipo.search("1", "2000-01-01", "2099-12-31", "ZT엑셀1", "2").get(0);
        assertThat(zt.priceBracket()).isEqualTo("공모가B");
        assertThat(zt.price()).isEqualTo(15000L);
        assertThat(zt.demandStartDate()).isEqualTo("2026-11-01");   // "20261101"
        assertThat(zt.demandCloseDate()).isEqualTo("2026-11-02");   // "2026.11.02"
        assertThat(zt.cancelYn()).isEqualTo("false");
        assertThat(ipo.search("1", "2000-01-01", "2099-12-31", "ZT엑셀2", "3").get(0).cancelYn()).isEqualTo("true");

        assertThatThrownBy(() -> ipo.upload(CUSTOMER, excel("x"))).isInstanceOf(BusinessException.class);
        assertThat(ipo.template()).hasSizeGreaterThan(1000);
    }

    @Test
    void 주간사_등록_수정_삭제() {
        assertThat(corp.search("")).hasSize(jdbc.queryForObject("select count(*) from sch12_ipo_corp", Integer.class));
        Sch12IpoCorpRes created = corp.update(ADMIN, List.of(new Sch12IpoCorpSaveReq(null, "ZT증권", "www.zt.example"))).get(0);
        assertThat(corp.search("zt증")).extracting(Sch12IpoCorpRes::ipoCorpId).contains(created.ipoCorpId());
        assertThat(corp.update(ADMIN, List.of(new Sch12IpoCorpSaveReq(created.ipoCorpId(), "ZT증권2", null))).get(0).homepage()).isNull();
        assertThatThrownBy(() -> corp.update(CUSTOMER, List.of())).isInstanceOf(BusinessException.class);
        assertThat(corp.delete(ADMIN, List.of(created.ipoCorpId()))).isEqualTo(1);
    }

    @Test
    void 종목코드_매칭_등록_수정_삭제() {
        Sch15IpoItemMatchingRes created = matching.update(ADMIN, List.of(new Sch15IpoItemMatchingSaveReq(null, "KR7ZT0000001", "KR7ZT0000002", "시험종목"))).get(0);
        assertThat(matching.search("kr7zt")).extracting(Sch15IpoItemMatchingRes::ipoItemMatchingId).contains(created.ipoItemMatchingId());
        assertThat(matching.update(ADMIN, List.of(new Sch15IpoItemMatchingSaveReq(created.ipoItemMatchingId(), "KR7ZT0000001", "KR7ZT0000003", "시험종목")))
                .get(0).validItemCode()).isEqualTo("KR7ZT0000003");
        assertThat(matching.delete(ADMIN, List.of(created.ipoItemMatchingId()))).isEqualTo(1);
    }

    @Test
    void 미일치내역_조회는_함수를_부르고_확인완료를_저장() {
        List<Sch14IpoMismatchRes> unchecked = mismatch.search(ADMIN, true);
        assertThat(unchecked).allSatisfy(r -> assertThat(r.checkYn()).isNotEqualTo("true"));
        List<Sch14IpoMismatchRes> all = mismatch.search(ADMIN, false);
        assertThat(all.size()).isGreaterThanOrEqualTo(unchecked.size());
        if (!all.isEmpty()) {
            Long id = all.get(0).ipoMismatchId();
            assertThat(mismatch.update(ADMIN, List.of(new Sch14IpoMismatchSaveReq(id, "true"))).get(0).checkYn()).isEqualTo("true");
        }
        assertThatThrownBy(() -> mismatch.search(CUSTOMER, true)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 종목정보_페이징_등록_수정_삭제_중복() {
        long total = jdbc.queryForObject("select count(*) from com50_item where com50_item_type = '2010'", Long.class);
        var page = item.searchPaging("2010", null, 300, 0);
        assertThat(page.total()).isEqualTo(total);
        assertThat(page.rows()).hasSize((int) Math.min(300, total));
        assertThat(item.searchPaging("2010", null, 300, 300).rows()).hasSize((int) Math.max(0, Math.min(300, total - 300)));

        Com50ItemRes created = item.update(ADMIN, List.of(new Com50ItemSaveReq(null, "KRZTTEST0001", "ZT시험종목", "2010"))).get(0);
        assertThat(item.searchPaging("2010", "zt시험", 300, 0).rows()).extracting(Com50ItemRes::itemId).contains(created.itemId());
        assertThatThrownBy(() -> item.update(ADMIN, List.of(new Com50ItemSaveReq(null, "KRZTTEST0001", "중복", "2010")))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("이미 등록된 종목코드 입니다 [KRZTTEST0001]");
        assertThat(item.update(ADMIN, List.of(new Com50ItemSaveReq(created.itemId(), "KRZTTEST0001", "ZT시험종목2", "2010"))).get(0).itemName()).isEqualTo("ZT시험종목2");
        assertThatThrownBy(() -> item.update(CUSTOMER, List.of())).isInstanceOf(BusinessException.class);
        assertThat(item.delete(ADMIN, List.of(created.itemId()))).isEqualTo(1);
    }

    /** 헤더 한 줄 + 데이터 두 줄. 날짜는 글자("20261101", "2026.11.02")로 넣어 getCellDate의 글자 경로를 탄다 */
    private static MockMultipartFile excel(String priceBracket) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("시장구분");
            fill(sheet.createRow(1), 2, "ZT엑셀1", "ZT001", "20261101", "2026.11.02", "2026-11-10", "20261111", "20261115", "20261120", priceBracket, 15000, "주간사1", "N");
            fill(sheet.createRow(2), 3, "ZT엑셀2", "ZT002", "20261201", "20261202", "20261210", "20261211", "20261215", "20261220", priceBracket, 20000, "주간사2", "Y");
            wb.write(out);
            return new MockMultipartFile("excelUpload", "ipo.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", out.toByteArray());
        }
    }

    private static void fill(Row row, int market, String name, String corp, String d1, String d2, String d3, String d4, String d5, String d6,
                             String bracket, int price, String note, String cancel) {
        row.createCell(0).setCellValue(market);
        row.createCell(1).setCellValue(name);
        row.createCell(2).setCellValue(corp);
        String[] dates = {d1, d2, d3, d4, d5, d6};
        for (int i = 0; i < dates.length; i++) {
            row.createCell(3 + i).setCellValue(dates[i]);
        }
        row.createCell(9).setCellValue(bracket);
        row.createCell(10).setCellValue(price);
        row.createCell(11).setCellValue(note);
        row.createCell(12).setCellValue(cancel);
    }
}
