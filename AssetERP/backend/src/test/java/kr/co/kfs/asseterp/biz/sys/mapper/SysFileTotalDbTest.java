package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.FileMonthRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalParam;
import kr.co.kfs.asseterp.biz.sys.dto.FileTotalRes;
import kr.co.kfs.asseterp.biz.sys.dto.FileYearRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * A16 고객별 서버사용량(Sys10_File.selectByTotalSize·Year·Month)을 asseterpdb에서 실제로 돌리고 롤백한다.
 * 지금 DB의 파일 경로는 원본이 가정하는 `/data1/IDMS/docs/{고객}/{yyyyMM}`(앞 17자) 형식이 아니라 조회가 0건이므로,
 * 그 형식의 시험 행을 넣어 SQL과 DTO 매핑(Double)이 맞는지 본다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SysFileTotalDbTest {

    @Autowired SysFileMapper mapper;
    @Autowired JdbcTemplate jdbc;

    private void insert(long id, String regDate, String path, double size) {
        jdbc.update("""
                INSERT INTO sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path, sys10_size,
                                        sys10_note, sys10_file_ext, sys10_file_yn, sys10_print_yn, sys10_ext_yn)
                VALUES (?, 1, 'a16-test', ?::timestamp, ?, ?, '', 'txt', 'false', 'true', 'false')
                """, id, regDate, path, size);
    }

    @Test
    void 서버경로에서_고객을_뽑아_연도_월별_용량을_합한다() {
        insert(990000000000001L, "2026-10-05", "/data1/IDMS/docs/kfstest/202610", 1500);
        insert(990000000000002L, "2025-03-05", "/data1/IDMS/docs/kfstest/202503", 500);

        List<FileTotalRes> totals = mapper.selectByTotalSize("true");
        FileTotalRes kfs = totals.stream().filter(t -> "kfstest".equals(t.locNm())).findFirst().orElseThrow();
        assertThat(kfs.totalSize()).isEqualTo(2.0);        // (1500 + 500) * 0.001 → 2.0
        assertThat(kfs.runningTotalSize()).isEqualTo(2.0);

        List<FileYearRes> years = mapper.selectByTotalSizeYear(new FileTotalParam("kfstest", null));
        assertThat(years).extracting(FileYearRes::year).containsExactly("2026", "2025");   // 연도 내림차순
        assertThat(years).extracting(FileYearRes::totalSize).containsExactly(1.5, 0.5);

        List<FileMonthRes> months = mapper.selectByTotalSizeMonth(new FileTotalParam("kfstest", "2026"));
        assertThat(months).extracting(FileMonthRes::month).containsExactly("10");
        assertThat(months.get(0).totalSize()).isEqualTo(1.5);

        // KIDMS가 들어간 경로(옛 서버)는 센 곳에서 뺀다
        insert(990000000000003L, "2026-10-06", "c:\\KIDMS\\docs\\kfstest/202610", 9000);
        assertThat(mapper.selectByTotalSizeMonth(new FileTotalParam("kfstest", "2026")).get(0).totalSize()).isEqualTo(1.5);
    }
}
