package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountAdminRes;
import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltAccountService;
import kr.co.kfs.asseterp.biz.flt.service.FltEmpService;
import kr.co.kfs.asseterp.biz.flt.service.FltTrStatusService;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
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

/** J07 임직원매매현황(읽기 + 메모 저장)을 asseterpdb에서 돌린다. 실제 사원(회사 28000). 테스트 트랜잭션이라 메모 저장은 롤백된다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltEmpService.class, FltTrStatusService.class, FltAccountService.class})
class FltEmpInfoDbTest {

    @Autowired FltEmpService empService;
    @Autowired FltTrStatusService trStatusService;
    @Autowired FltAccountService accountService;
    @Autowired SysFileMapper fileMapper;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    @Test
    void 임직원매매현황은_기준일_재직_사원이_읽히고_검색_엑셀_설정이_나온다() throws IOException {
        // AS-IS 안쪽 사원 CTE를 yunhee sql로 센 값: 2026-09-30 기준 회사 28000 → 48명(가족동의서 ○ 2, 계좌 있음 6)
        List<EmpInfoRes> all = empService.searchInfos(user, "2026-09-30", null);
        assertThat(all).hasSize(48);
        assertThat(all).extracting(EmpInfoRes::empId).doesNotHaveDuplicates();
        assertThat(all).filteredOn(r -> "○".equals(r.familyYnName())).hasSize(2);
        assertThat(all).filteredOn(r -> !"0건".equals(r.accountCntStr())).hasSize(6);
        assertThat(all).allMatch(r -> r.violateCntStr().endsWith("건") && r.noteDate() != null);
        assertThat(empService.searchInfos(user, "2026-09-30", "zzzz없는이름")).isEmpty();
        assertThat(empService.searchInfos(user, "2026-09-30", all.get(0).personName())).isNotEmpty();
        assertThat(empService.setting(user, "2026-09-30")).isNotNull();
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(empService.downloadInfos(user, "2026-09-30", null)))) {
            assertThat(wb.getSheetAt(0).getLastRowNum()).isEqualTo(48);
        }
    }

    @Test
    void 메모는_없으면_만들고_저장하면_있음으로_나온다() {
        EmpInfoRes emp = empService.searchInfos(user, "2026-09-30", null).get(0);
        TrStatusRes row = trStatusService.get(user, emp.personId(), emp.noteDate());
        assertThat(row.trStatusId()).isNotNull();
        assertThat(row.date()).isEqualTo(emp.noteDate());
        TrStatusRes saved = trStatusService.update(user, new TrStatusSaveReq(row.trStatusId(), "테스트 메모"));
        assertThat(saved.note()).isEqualTo("테스트 메모");
        assertThat(empService.searchInfos(user, "2026-09-30", emp.personName()))
                .filteredOn(r -> r.personId().equals(emp.personId())).allMatch(r -> "있음".equals(r.note()));
    }

    @Test
    void 계좌정보와_가족동의서_파일은_사원_한_명만_읽힌다() {
        List<AccountAdminRes> accounts = accountService.searchByDate(user, 29049L, "2026-09-30", true);
        assertThat(accounts).isNotEmpty().allMatch(a -> a.apprRegDate() == null || a.apprRegDate().length() == 10);
        assertThat(accounts.size()).isLessThan(accountService.searchByDate(user, "2026-09-30", true).size());
        List<FileRes> files = fileMapper.selectByFamilyConsentId(28000L, 29049L);
        assertThat(files).hasSize(1);
        assertThat(fileMapper.selectByFamilyConsentId(1L, 29049L)).isEmpty();  // 다른 회사에서는 안 보인다
    }
}
