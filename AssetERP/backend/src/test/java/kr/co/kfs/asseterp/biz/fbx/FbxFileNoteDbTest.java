package kr.co.kfs.asseterp.biz.fbx;

import kr.co.kfs.asseterp.biz.fbx.mapper.FbxFileMapper;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/** SFU02 uploadFbx03 L297 — 첨부 비고 갱신 SQL이 sys10_file 한 행만 바꾸는지 (롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class FbxFileNoteDbTest {

    @Autowired FbxFileMapper mapper;
    @Autowired JdbcTemplate jdbc;

    @Test
    void 첨부_비고를_한_행만_바꾼다() {
        Long id = jdbc.queryForObject("select sys10_file_id from sys10_file order by sys10_file_id desc limit 1", Long.class);
        String note = "파일보관함: boxId:1, classid:2, orgCodeId:3, empId:4";
        assertThat(mapper.updateAttachNote(id, note)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select sys10_note from sys10_file where sys10_file_id=?", String.class, id)).isEqualTo(note);
    }
}
