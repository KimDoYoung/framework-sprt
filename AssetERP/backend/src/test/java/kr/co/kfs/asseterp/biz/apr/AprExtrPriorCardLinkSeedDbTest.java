package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileInputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.CardLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.ExtrActivityLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.apr.service.link.PriorApprovalLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardExcelRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.biz.service.BizCardExcelService;
import kr.co.kfs.asseterp.biz.biz.service.BizRelateApprService;
import kr.co.kfs.asseterp.biz.ics.service.IcsExtrActivityService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V29 A10~A12 이익제공(수령) · A41 이익제공(법인카드) · B15·B16 대외활동 결재창 제목·본문, 문서 ID 기록, 법인카드 첨부 엑셀을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, ExtrActivityLinkSeedProvider.class, PriorApprovalLinkSeedProvider.class, CardLinkSeedProvider.class,
        FormMappingLinkSeedSupport.class, IcsExtrActivityService.class})
class AprExtrPriorCardLinkSeedDbTest {

    private static final long APPR = 202609229873969L;
    /** 신청자 202204180108329, 상신 문서 있는 건 */
    private static final long EXTR = 202601139258336L;
    private static final long EXTR_APPR = 202601139258337L;

    @Autowired AprLinkSeedService seedService;
    @Autowired IcsExtrActivityService extrService;
    @Autowired BizPromoMapper promoMapper;
    @Autowired BizRelateApprMapper relateMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(202204180108329L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 대외활동_활동신청_B15는_제목과_본문_치환() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "B15", EXTR, Map.of());
        String corp = jdbc.queryForObject("select ics35_activity_corp from ics35_extr_activity where ics35_extr_activity_id = ?", String.class, EXTR);
        assertThat(res.title()).startsWith("임직원 대외활동 승인 신청 - ").endsWith("(" + corp + ")");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        if (res.content() != null) {
            assertThat(res.content()).doesNotContain("#{성명}").doesNotContain("#{활동처}").doesNotContain("#{첨부자료}");
        }
    }

    @Test
    void 대외활동_양식이_있으면_키를_치환하고_결과보고에는_첨부자료가_없다() {
        // 시험 DB에는 B15·B16 양식이 없어 롤백 안에서 만든다
        jdbc.update("insert into com10_form_mapping (com10_form_mapping_id, com10_company_id, com10_title, com10_content) values (990000000000001, 28000, '시험', '<p>#{성명}|#{사번}|#{활동처}|#{활동대상}|#{신청일자}|#{활동내용}|#{첨부자료}</p>')");
        jdbc.update("insert into dcr30_link (dcr30_link_id, dcr30_link_cd, dcr30_class_tree_id, dcr30_company_id, dcr30_form_mapping_id) values (990000000000002, 'B15', ?, 28000, 990000000000001)", classTreeId());
        jdbc.update("insert into dcr30_link (dcr30_link_id, dcr30_link_cd, dcr30_class_tree_id, dcr30_company_id, dcr30_form_mapping_id) values (990000000000003, 'B16', ?, 28000, 990000000000001)", classTreeId());
        String name = jdbc.queryForObject("select emp01_kor_nm from emp01_person where emp01_person_id = 202204180108329", String.class);

        String b15 = seedService.seed(user(), classTreeId(), "B15", EXTR, Map.of()).content();
        assertThat(b15).startsWith("<p>" + name + "|").doesNotContain("#{");
        String b16 = seedService.seed(user(), classTreeId(), "B16", EXTR, Map.of()).content();
        assertThat(b16).startsWith("<p>" + name + "|").contains("#{첨부자료}"); // createResultMapping에는 첨부자료 키가 없다
    }

    @Test
    void 대외활동_결과보고_B16은_결과보고서_제목() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "B16", EXTR, Map.of());
        assertThat(res.title()).startsWith("임직원 대외활동 결과보고서 - ");
        if (res.content() != null) {
            assertThat(res.content()).doesNotContain("#{성명}").doesNotContain("#{활동내용}");
        }
    }

    @Test
    void 대외활동_ID가_없거나_남의_회사면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "B15", 1L, Map.of()));
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("남").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, classTreeId(), "B15", EXTR, Map.of()));
    }

    @Test
    void 대외활동_결재_ID_기록은_로그인_회사_행만이고_첨부는_한_번만_연결() {
        extrService.updateApprId(user(), EXTR, EXTR_APPR);
        assertThat(jdbc.queryForObject("select ics35_appr_id from ics35_extr_activity where ics35_extr_activity_id = ?", Long.class, EXTR)).isEqualTo(EXTR_APPR);
        int fileCnt = jdbc.queryForObject("select count(*) from sys10_file where sys10_parent_id = ?", Integer.class, EXTR);
        int linked = jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_parent_id = ? and sys11_parent_table = 'apr01_appr' and sys11_file_id in (select sys10_file_id from sys10_file where sys10_parent_id = ?)", Integer.class, EXTR_APPR, EXTR);
        assertThat(linked).isGreaterThanOrEqualTo(fileCnt > 0 ? 1 : 0);
        extrService.updateApprId(user(), EXTR, EXTR_APPR); // 다시 해도 늘지 않는다
        int again = jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_parent_id = ? and sys11_parent_table = 'apr01_appr' and sys11_file_id in (select sys10_file_id from sys10_file where sys10_parent_id = ?)", Integer.class, EXTR_APPR, EXTR);
        assertThat(again).isEqualTo(linked);

        extrService.updateResultApprId(user(), EXTR, EXTR_APPR);
        assertThat(jdbc.queryForObject("select ics35_result_appr_id from ics35_extr_activity where ics35_extr_activity_id = ?", Long.class, EXTR)).isEqualTo(EXTR_APPR);

        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("남").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> extrService.updateApprId(other, EXTR, EXTR_APPR));
        assertThrows(BusinessException.class, () -> extrService.updateResultApprId(other, EXTR, EXTR_APPR));
    }

    @Test
    void 이익제공_수령_A10_A12는_구분이름_사원이름_제목과_양식_본문() {
        for (String code : List.of("A10", "A11", "A12")) {
            AprLinkSeedRes res = seedService.seed(user(), classTreeId(), code, null, Map.of("typeName", "이익제공 사전승인"));
            assertThat(res.title()).isEqualTo("이익제공 사전승인_시험");
            assertThat(res.titleReadOnly()).isTrue();
            assertThat(res.saveVisible()).isFalse();
        }
    }

    @Test
    void 법인카드_A41은_화면이_만든_제목과_보고_본문() {
        // 원본 2026-11-06(c0b1e1146): 제목 = 화면의 "[법인카드] yyyy년 MM월 지출결의 승인 요청의건_계정과목 외 n", 본문 고정
        String title = "[법인카드] 2026년 02월 지출결의 승인 요청의건_접대비 외 1";
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A41", null, Map.of("title", title));
        assertThat(res.title()).isEqualTo(title);
        assertThat(res.content()).isEqualTo("법인카드 사용내역을 보고합니다.");
        assertThat(res.titleReadOnly()).isFalse();
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A41", null, Map.of()));
    }

    @Test
    void 법인카드_첨부_엑셀은_머리줄_내역_합계줄() throws Exception {
        UserPrincipal u = UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
        // 원본 2026-11-06: 내역 = 고른 내역(ID), 파일 이름 = 문서 제목. 29049의 2025~2026 내역을 고른 것으로 한다
        List<Long> ids = jdbc.queryForList("select biz01_promo_id from biz01_promo where biz01_company_id = 28000 and biz01_real_person_id = 29049"
                + " and biz01_provide_date between '2025-01-01' and '2026-12-31' order by 1", Long.class);
        List<BizCardExcelRow> rows = promoMapper.selectByCardExcel(28000L, ids);
        assertThat(promoMapper.selectByCardExcel(1L, ids)).isEmpty();   // 다른 회사 내역은 안 나온다

        SysFileService sysFile = mock(SysFileService.class);
        AtomicReference<byte[]> saved = new AtomicReference<>();
        AtomicReference<String> savedName = new AtomicReference<>();
        when(sysFile.registerRdFile(any(File.class), anyLong(), anyString(), anyString(), eq("xls"))).thenAnswer(inv -> {
            try (FileInputStream in = new FileInputStream((File) inv.getArgument(0))) {
                saved.set(in.readAllBytes());
            }
            savedName.set(inv.getArgument(3));
            return 1L;
        });
        BizCardExcelService excel = new BizCardExcelService(promoMapper, relateMapper, sysFile);
        String title = "[법인카드] 2025년 01월 지출결의 승인 요청의건";
        assertThat(excel.createCardExcel(u, APPR, ids, title)).isEqualTo(1L);

        assertThat(rows).isNotEmpty().hasSize(ids.size()); // 시험 DB: 29049의 2025~2026 내역 4건
        assertThat(savedName.get()).isEqualTo(title + ".xls");
        try (HSSFWorkbook wb = new HSSFWorkbook(new java.io.ByteArrayInputStream(saved.get()))) {
            HSSFSheet sheet = wb.getSheetAt(0);
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("카드승인일");
            assertThat(sheet.getRow(0).getCell(5).getStringCellValue()).isEqualTo("비고");
            assertThat(sheet.getRow(0).getCell(14).getStringCellValue()).isEqualTo("카드 사용자");
            assertThat(sheet.getLastRowNum()).isEqualTo(rows.size() + 1);
            assertThat(sheet.getRow(rows.size() + 1).getCell(1).getStringCellValue()).isEqualTo("합계");
            double sum = rows.stream().mapToLong(r -> r.provideAmt() == null ? 0 : r.provideAmt()).sum();
            assertThat(sheet.getRow(rows.size() + 1).getCell(2).getNumericCellValue()).isEqualTo(sum);
            assertThat(sheet.getRow(1).getCell(10).getNumericCellValue()).isEqualTo(rows.get(0).averagePrice().doubleValue());
        }
    }

    @Test
    void 법인카드_그_달_상신_연결은_행을_지우고_다시_넣는다() {
        // 원본 2026-11-06부터 #1131은 이 길을 쓰지 않는다(행마다 상신 — BizCardApprService). 남은 API의 동작만 확인
        UserPrincipal u = UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
        BizRelateApprService service = new BizRelateApprService(relateMapper);
        var req = new kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprPersonReq("2099.01", APPR, "A41", LocalDate.of(2099, 1, 1), LocalDate.of(2099, 1, 31), "");

        long first = service.insertPersonId(u, req);
        long second = service.insertPersonId(u, req);
        assertThat(second).isNotEqualTo(first);
        assertThat(jdbc.queryForObject("select count(*) from biz05_relate_appr where biz05_std_ym = '2099.01' and biz05_link_cd = 'A41' and biz05_person_id = 29049 and biz05_company_id = 28000", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select biz05_appr_id from biz05_relate_appr where biz05_relate_appr_id = ?", Long.class, second)).isEqualTo(APPR);
    }
}
