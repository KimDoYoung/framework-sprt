package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprEditFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileOptionsReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Row;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprAttachService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V05 불러오기·양식·첨부 옵션설정·추가/삭제를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprAttachService.class, AprApprDetailService.class, AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprAttachDbTest {

    @Autowired AprAttachService service;
    @Autowired AprApprWriteService write;
    @Autowired JdbcTemplate jdbc;

    private static final long ME = 29035L;
    /** 결재완료(30) 문서, 상신자 29035 */
    private static final long DONE = 202409031964769L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    /** 내 임시저장 문서 하나를 만든다 */
    private long draft() {
        long classTree = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = 202609229873969", Long.class);
        long id = write.nextApprId();
        List<AprApprSaveStepReq> steps = List.of(new AprApprSaveStepReq(null, "00", "001", null, ME, "false", null), new AprApprSaveStepReq(null, "10", "002", null, 202312071648256L, "false", null));
        assertThat(write.save(user(ME), id, new AprApprSaveReq("save", classTree, null, "첨부 옵션 시험", "<p>본문</p>", null, LocalDateTime.of(2026, 11, 2, 0, 0), LocalDateTime.of(2026, 10, 31, 0, 0),
                null, null, null, "20", null, null, null, null, "의견", false, steps)).ok()).isTrue();
        return id;
    }

    private long addFile(long parent, String name) {
        long fileId = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path) values (?, ?, ?, now(), '/tmp/v05')", fileId, parent, name);
        return fileId;
    }

    @Test
    void 불러오기_목록은_내가_볼_수_있는_문서를_기간과_검색어로_가른다() {
        List<AprLoadDoc2Row> rows = service.loadDocs(user(29049L), null, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 10, 31), "");
        assertThat(rows).isNotEmpty();
        assertThat(rows.get(0).authYn()).isTrue();
        assertThat(rows.get(0).fundDisplayName()).isNotBlank();
        String title = rows.get(0).title();
        assertThat(service.loadDocs(user(29049L), null, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 10, 31), title).stream().map(AprLoadDoc2Row::title)).contains(title);
        assertThatThrownBy(() -> service.loadDocs(user(29049L), null, null, LocalDate.now(), "")).hasMessageContaining("조회기간 시작일을 선택하세요");
        // 문서분류를 주면 그 아래 분류 문서만
        long classTree = rows.get(0).apprId() == null ? 0 : jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, rows.get(0).apprId());
        assertThat(service.loadDocs(user(29049L), classTree, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 10, 31), "")).isNotEmpty();
    }

    @Test
    void 양식_목록은_문서분류에_연결된_것과_전체보기를_가른다() {
        List<?> all = service.docForms(user(29049L), null, true, "", "%");
        assertThat(all).isNotEmpty();
        long classTree = jdbc.queryForObject("select b.dcr06_class_tree_id from dcr06_relate_doc_type b join dcr05_doc_type a on a.dcr05_doc_type_id = b.dcr06_doc_type_id where a.dcr05_company_id = 28000 limit 1", Long.class);
        assertThat(service.docForms(user(29049L), classTree, false, "", "%")).isNotEmpty();
        assertThat(service.docForms(user(29049L), classTree, false, "", "%").size()).isLessThanOrEqualTo(all.size());
    }

    @Test
    void 옵션설정은_새_문서와_임시저장에서만_되고_완료_문서는_거절한다() {
        long id = draft();
        long f1 = addFile(id, "a.txt");
        long f2 = addFile(id, "b.txt");
        service.saveOptions(user(ME), id, new AprFileOptionsReq(List.of(new AprFileOptionsReq.Item(f1, true, true, "002"), new AprFileOptionsReq.Item(f2, false, true, "001"))));
        List<AprEditFileRes> files = service.getEditFiles(user(ME), id);
        assertThat(files.get(0).fileId()).isEqualTo(f2);          // 순서(seq) 001이 먼저
        assertThat(files.get(0).printYn()).isFalse();
        assertThat(files.get(1).printYn()).isTrue();
        assertThat(files.get(1).extYn()).isTrue();
        // 문서 행이 없는 새 문서도 된다
        long fresh = write.nextApprId();
        long f3 = addFile(fresh, "c.txt");
        service.saveOptions(user(ME), fresh, new AprFileOptionsReq(List.of(new AprFileOptionsReq.Item(f3, true, false, "001"))));
        assertThat(service.getEditFiles(user(ME), fresh)).hasSize(1);
        // 결재완료 문서는 관리자가 아니면 못 바꾼다
        assertThatThrownBy(() -> service.saveOptions(user(ME), DONE, new AprFileOptionsReq(List.of()))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 반려_문서의_첨부파일은_사유와_함께_삭제_내역으로_옮겨진다() {
        long id = draft();
        jdbc.update("update apr01_appr set apr01_status_cd = '40' where apr01_appr_id = ?", id);
        long keep = addFile(id, "keep.txt");
        long del = addFile(id, "del.txt");
        service.deleteFiles(user(ME), id, List.of(del), "잘못 올림");
        assertThat(service.getEditFiles(user(ME), id)).extracting(AprEditFileRes::fileId).containsExactly(keep);
        List<AprFileDelRes> dels = service.getFileDels(user(ME), id);
        assertThat(dels).hasSize(1);
        assertThat(dels.get(0).fileId()).isEqualTo(del);
        assertThat(dels.get(0).reason()).isEqualTo("잘못 올림");
        assertThat(dels.get(0).personName()).isNotBlank();
        // 파일은 지워지지 않고 부모만 삭제 내역 ID로 옮겨졌다 + 비고에 삭제자
        assertThat(jdbc.queryForObject("select sys10_parent_id from sys10_file where sys10_file_id = ?", Long.class, del)).isEqualTo(dels.get(0).fileDelId());
        assertThat(jdbc.queryForObject("select sys10_note from sys10_file where sys10_file_id = ?", String.class, del)).contains("[삭제 empId:" + ME + "]");
        // 이 문서의 파일이 아니면 거절, 반려가 아니면 거절
        assertThatThrownBy(() -> service.deleteFiles(user(ME), id, List.of(999L), "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.deleteFiles(user(ME), DONE, List.of(1L), "x")).isInstanceOf(BusinessException.class);
    }
}
