package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUseYnReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUserRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteGroupReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistService;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchWriteGroupService;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** K04 내부통제 체크리스트 관리(Ics10_Tab_Checklist·Ics10_Lookup_UseYn·Ics10_Lookup_ExcelUpload·Sch22_Lookup_WriteGroup·Sch02_Page_Share)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcsChecklistService.class, SchWriteGroupService.class})
class IcsChecklistK04DbTest {

    @Autowired IcsChecklistService checklist;
    @Autowired SchWriteGroupService groups;
    @Autowired JdbcTemplate jdbc;

    private static final long COMPANY = 28000L;
    private static final UserPrincipal USER = UserPrincipal.builder().companyId(COMPANY).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 조회는_공통과_회사_체크리스트_사용여부_필터() {
        List<IcsChecklistUserRes> all = checklist.searchForCompany(USER, null, null, "true", "");
        assertThat(all).isNotEmpty();
        assertThat(all).allSatisfy(r -> assertThat(r.companyId()).isIn(0L, COMPANY));
        assertThat(checklist.searchForCompany(USER, null, null, "%", "")).hasSizeGreaterThanOrEqualTo(all.size());
        Long mClass = all.get(0).checklistMClassId();
        assertThat(checklist.searchForCompany(USER, null, mClass, "true", "")).allSatisfy(r -> assertThat(r.checklistMClassId()).isEqualTo(mClass));
    }

    @Test
    void 사용여부_저장과_담당그룹_지정은_ics11을_만들고_고친다() {
        // 공통(회사 0) 체크리스트로 본다 — 고객사가 만든 것은 미사용으로 저장하면 ics10 사용여부도 false가 되어(AS-IS) 조회 SQL(ics10_use_yn = 'true')에서 둘 다 빠진다
        IcsChecklistUserRes row = checklist.searchForCompany(USER, null, null, "true", "").stream().filter(r -> r.companyId() == 0L).findFirst().orElseThrow();
        long id = row.checklistId();
        jdbc.update("delete from ics11_checklist_company where ics11_company_id = ? and ics11_checklist_id = ?", COMPANY, id);

        checklist.updateUseYn(USER, List.of(new IcsChecklistUseYnReq(id, "false")));
        assertThat(jdbc.queryForObject("select ics11_use_yn from ics11_checklist_company where ics11_company_id = ? and ics11_checklist_id = ?", String.class, COMPANY, id)).isEqualTo("false");
        assertThat(checklist.searchForCompany(USER, null, null, "true", "")).noneMatch(r -> r.checklistId() == id);
        assertThat(checklist.searchForCompany(USER, null, null, "false", "")).anyMatch(r -> r.checklistId() == id);

        Sch22WriteGroupRes g = groups.save(USER, List.of(new Sch22WriteGroupSaveReq(null, "ZT그룹", null))).get(0);
        checklist.updateWriteGroup(USER, new IcsChecklistWriteGroupReq(g.writeGroupId(), List.of(new IcsChecklistUseYnReq(id, "false"))));
        assertThat(checklist.searchForCompany(USER, null, null, "false", "")).filteredOn(r -> r.checklistId() == id)
                .singleElement().satisfies(r -> assertThat(r.writeGroupName()).isEqualTo("ZT그룹"));
        assertThat(groups.inUse(g.writeGroupId())).isTrue();
        checklist.updateWriteGroup(USER, new IcsChecklistWriteGroupReq(null, List.of(new IcsChecklistUseYnReq(id, "false"))));
        assertThat(groups.inUse(g.writeGroupId())).isFalse();
    }

    @Test
    void 작성그룹_저장_공유_삭제() {
        Sch22WriteGroupRes g = groups.save(USER, List.of(new Sch22WriteGroupSaveReq(null, "ZT그룹", null))).get(0);
        assertThat(g.writeGroupId()).isPositive();
        Sch22WriteGroupRes renamed = groups.save(USER, List.of(new Sch22WriteGroupSaveReq(g.writeGroupId(), "ZT그룹2", null))).get(0);
        assertThat(renamed.writeGroupName()).isEqualTo("ZT그룹2");
        assertThat(groups.search(USER)).anyMatch(r -> r.writeGroupId().equals(g.writeGroupId()));

        Long org = jdbc.queryForObject("select org01_code_id from org01_code limit 1", Long.class);
        Sch02ShareRes share = groups.saveShares(USER, g.writeGroupId(), List.of(new Sch02ShareSaveReq(null, "2", null, org, LocalDate.of(2026, 10, 1), null))).get(0);
        assertThat(groups.searchShares(USER, g.writeGroupId())).hasSize(1);
        Sch02ShareRes moved = groups.saveShares(USER, g.writeGroupId(), List.of(new Sch02ShareSaveReq(share.shareId(), "2", null, org, LocalDate.of(2026, 10, 1), LocalDate.of(2026, 12, 31)))).get(0);
        assertThat(moved.closeDate()).isEqualTo(LocalDate.of(2026, 12, 31));
        groups.checkDeleteShares(List.of(share.shareId()));
        assertThat(groups.deleteShares(USER, g.writeGroupId(), List.of(share.shareId()))).isEqualTo(1);

        groups.saveShares(USER, g.writeGroupId(), List.of(new Sch02ShareSaveReq(null, "2", null, org, LocalDate.of(2026, 10, 1), null)));
        assertThat(groups.delete(USER, g.writeGroupId())).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from sch02_share where sch02_info_id = ?", Integer.class, g.writeGroupId())).isZero();
        assertThatThrownBy(() -> groups.saveShares(USER, g.writeGroupId(), List.of())).isInstanceOf(BusinessException.class);
    }

    @Test
    void 엑셀업로드_성공과_AS_IS_오류_메시지() throws IOException {
        Map<String, Object> cls = jdbc.queryForMap("select ics21_checklist_l_class_nm l, ics23_checklist_m_class_nm m from ics21_checklist_l_class"
                + " join ics23_checklist_m_class on ics23_checklist_l_class_id = ics21_checklist_l_class_id where ics21_company_id = 0 and ics23_company_id = 0 limit 1");
        int before = jdbc.queryForObject("select count(*) from ics10_checklist where ics10_company_id = ?", Integer.class, COMPANY);

        assertThat(checklist.upload(USER, xlsx(new Object[]{cls.get("l"), cls.get("m"), "ZT 체크대상", "ZT 근거", 7}, new Object[]{cls.get("l"), cls.get("m"), "ZT 체크대상2", null, null}))).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from ics10_checklist where ics10_company_id = ?", Integer.class, COMPANY)).isEqualTo(before + 2);

        assertThatThrownBy(() -> checklist.upload(USER, xlsx(new Object[]{"없는분류", cls.get("m"), "x"}))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("(에러 : 2행) 대분류는 존재하지 않는 값입니다. [없는분류]");
        assertThatThrownBy(() -> checklist.upload(USER, xlsx(new Object[]{cls.get("l"), "없는중분류", "x"}))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("(에러 : 2행) 중분류는 존재하지 않는 값입니다. [없는중분류]");
        assertThatThrownBy(() -> checklist.upload(USER, xlsx(new Object[]{cls.get("l"), cls.get("m"), null, null, null, "비어있지않음"}))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("(에러 : 2행) 체크대상은 필수입력입니다.");
    }

    @Test
    void 출력과_템플릿은_xlsx를_돌려준다() {
        assertThat(checklist.export(USER, null, null, "")).startsWith((byte) 'P', (byte) 'K');
        assertThat(checklist.template()).startsWith((byte) 'P', (byte) 'K');
    }

    /** 첫 행은 머리글, 2번째 행부터 데이터(AS-IS) */
    private static MockMultipartFile xlsx(Object[]... rows) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("대분류");
            int r = 1;
            for (Object[] data : rows) {
                Row row = sheet.createRow(r++);
                for (int c = 0; c < data.length; c++) {
                    if (data[c] instanceof Number n) row.createCell(c).setCellValue(n.doubleValue());
                    else if (data[c] != null) row.createCell(c).setCellValue(data[c].toString());
                }
            }
            wb.write(out);
            return new MockMultipartFile("excelUpload", "t.xlsx", "application/octet-stream", out.toByteArray());
        }
    }
}
