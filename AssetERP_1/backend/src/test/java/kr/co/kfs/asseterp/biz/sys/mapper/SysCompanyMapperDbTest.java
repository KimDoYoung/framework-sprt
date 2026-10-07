package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CodeSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOrgParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanySearchParam;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * A15 매퍼 SQL을 asseterpdb에서 실제로 실행하고 롤백한다(@MybatisTest는 테스트마다 트랜잭션 롤백 — 03 원칙 2: 데이터를 남기지 않는다).
 * 회사 등록 + 초기화 13단계가 이 DB에서 돌고, admin(0) 기준 데이터가 복사되는지 본다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SysCompanyMapperDbTest {

    @Autowired SysCompanyMapper mapper;
    @Autowired SysCodeMapper codeMapper;
    @Autowired JdbcTemplate jdbc;

    private int count(String table, String companyCol, Long companyId) {
        return jdbc.queryForObject("select count(*) from " + table + " where " + companyCol + " = ?", Integer.class, companyId);
    }

    @Test
    void 회사를_등록하고_초기화하면_admin_기준_데이터가_복사된다() {
        Long id = mapper.selectNextId();
        LocalDate start = LocalDate.of(2025, 1, 1);
        mapper.insertCompany(new CompanyRow(id, "ZZ_A15_DB시험", "zza15dbtest", "1111", start, null, "ZZ-A15-0000", null, "1", null));
        CompanyOrgParam org = new CompanyOrgParam(id, mapper.selectNextId(), mapper.selectNextId(), "ZZ_A15_DB시험", start);
        assertThat(mapper.insertOrgCode(org)).isEqualTo(1);
        assertThat(mapper.insertOrgInfo(org)).isEqualTo(1);
        assertThat(mapper.insertCodesFromAdmin(id)).isPositive();
        mapper.importDcrFromAdmin(id);
        mapper.insertAstDetailFromAdmin(id);
        mapper.insertLeaveYearFromAdmin(id);
        mapper.insertPayFormulaFromAdmin(id);
        assertThat(mapper.insertIcsManager(id)).isEqualTo(1);
        assertThat(mapper.insertAccountCodesFromAdmin(id)).isPositive();
        mapper.insertCompliancesFromAdmin(id);
        mapper.insertComplianceAnswersFromAdmin(id);
        mapper.insertApplicationFormsFromAdmin(id);
        mapper.insertExpenseFormsFromAdmin(id);
        mapper.insertFormMappingsFromAdmin(id);

        assertThat(count("dcr01_class_tree", "dcr01_company_id", id)).isEqualTo(count("dcr01_class_tree", "dcr01_company_id", 0L));
        assertThat(count("sys30_leave_year", "sys30_company_id", id)).isEqualTo(count("sys30_leave_year", "sys30_company_id", 0L));
        assertThat(count("act01_account_code", "act01_company_id", id)).isEqualTo(count("act01_account_code", "act01_company_id", 0L));

        CompanyRes saved = mapper.selectCompany(id);
        assertThat(saved.companyNm()).isEqualTo("ZZ_A15_DB시험");
        assertThat(saved.useYn()).isEqualTo("false");            // AS-IS: 팝업은 사용여부를 넣지 않고, 모델 getter는 null → false
        assertThat(saved.apprStepLockYn()).isEqualTo("true");    // getter 기본값
        assertThat(saved.leaveCompulsionRt()).isEqualTo(100L);   // getter 기본값
        assertThat(saved.taxTypeNm()).isNotBlank();              // 복사된 TaxType 코드로 이름이 나온다
        // 목록: 사용고객만(useYn=true)에서도 null 사용여부는 보인다(COALESCE(use_yn,'true'))
        assertThat(mapper.searchCompanies(new CompanySearchParam("%ZZA15DBTEST%", "true"))).hasSize(1);
        assertThat(mapper.countByLocNm("ZZA15DBTEST")).isEqualTo(1);
        // 새 회사의 공통코드 콤보(시스템 코드가 아닌 것은 복사본)
        assertThat(codeMapper.searchCodesByKind(new CodeSearchParam(id, "MonthsCode"))).hasSize(12);
    }
}
