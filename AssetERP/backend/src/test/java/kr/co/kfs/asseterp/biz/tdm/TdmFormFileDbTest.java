package kr.co.kfs.asseterp.biz.tdm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.biz.sys.service.SysRelateFileService;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.FormFileSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmFormFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/** N28 이행점검 연관양식 등록(Tdm43_Tab_RelateFormFileUpload)의 조회·저장·업로드를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({TdmFormFileService.class, SysRelateFileService.class})
class TdmFormFileDbTest {

    @Autowired TdmFormFileService service;
    @Autowired SysRelateFileService relateFileService;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean SysFileService fileService;

    /** kfstest — 양식 4건 */
    private static final long COMPANY = 28000L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(29037L).companyId(COMPANY).name("N28시험").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();

    @Test
    void 조회는_구분과_검색어로_걸러_파일명_순으로_준다() {
        List<FormFileRes> all = service.search(USER, "%", "");
        assertThat(all).hasSizeGreaterThanOrEqualTo(4);
        assertThat(all).allSatisfy(r -> {
            assertThat(r.parentId()).isEqualTo(COMPANY);
            assertThat(r.tdmCheckFormType()).isNotBlank();
            assertThat(r.fileName()).isNotBlank();
        });
        assertThat(all.get(0).tdmCheckFormTypeName()).isNotBlank();
        assertThat(service.search(USER, "%", "Template_일임")).extracting(FormFileRes::fileName).containsExactly("Template_일임계좌정보.xlsx");
        assertThat(service.search(USER, "%", "test12121")).hasSize(1);           // 비고도 검색
        assertThat(service.search(USER, "99999", "")).isEmpty();                 // 없는 구분
        assertThat(service.search(OTHER, "%", "")).isEmpty();                    // 다른 회사는 자기 것만
    }

    @Test
    void 저장은_구분과_비고만_바꾸고_다른_회사_파일은_막는다() {
        FormFileRes row = service.search(USER, "%", "Template_일임").get(0);
        service.save(USER, List.of(new FormFileSaveReq(row.fileId(), row.tdmCheckFormType(), "N28 시험 비고")));
        FormFileRes after = service.search(USER, "%", "Template_일임").get(0);
        assertThat(after.note()).isEqualTo("N28 시험 비고");
        assertThat(after.fileName()).isEqualTo(row.fileName());
        assertThat(after.regDate()).isEqualTo(row.regDate());
        assertThatThrownBy(() -> service.save(OTHER, List.of(new FormFileSaveReq(row.fileId(), row.tdmCheckFormType(), "남")))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 업로드는_구분_없이는_막고_올린_행에_구분_비고_등록자를_채운다() {
        MockMultipartFile file = new MockMultipartFile("file", "n28.txt", "text/plain", "x".getBytes());
        assertThatThrownBy(() -> service.upload(USER, null, "비고", file)).isInstanceOf(BusinessException.class).hasMessageContaining("구분을 선택하세요");

        long fileId = 900000000000001L;
        jdbc.update("INSERT INTO sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path) VALUES (?, ?, 'n28.txt', now(), '/tmp')", fileId, COMPANY);
        when(fileService.upload(any(), eq(COMPANY), any(), any(), any()))
                .thenReturn(new FileRes(fileId, COMPANY, "n28.txt", null, "/tmp", 0d, null, "txt", "false", null, null));
        service.upload(USER, "90000", null, file);
        assertThat(jdbc.queryForMap("SELECT sys10_tdm_check_form_type t, sys10_note n, sys10_person_id p FROM sys10_file WHERE sys10_file_id = ?", fileId))
                .containsEntry("t", "90000").containsEntry("n", "").containsEntry("p", new java.math.BigDecimal(29037));
    }

    @Test
    void 삭제_판정은_점검항목에_연결된_양식을_막고_연결이_없거나_고아면_지우게_한다() {
        // 연결된 양식(점검항목 tdm43_manl이 아직 있음) → AS-IS checkFileDelete03: 상태 2 "사용중인 파일"
        SysRelateFileService.DeleteCheck linked = relateFileService.checkFileDelete(202603069501647L, COMPANY);
        assertThat(linked.status()).isEqualTo(2);
        assertThat(linked.message()).isEqualTo("해당 파일은 사용중인 파일이므로 삭제할 수 없습니다");

        // MyBatis 1차 캐시가 같은 질의 결과를 재사용하므로 경우마다 다른 파일을 쓴다
        long none = 900000000000002L, orphan = 900000000000012L, noTable = 900000000000022L, own = 900000000000032L;
        for (long id : new long[]{none, orphan, noTable, own}) {
            jdbc.update("INSERT INTO sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path, sys10_tdm_check_form_type) VALUES (?, ?, 'n28b.txt', now(), '/tmp', '90000')", id, COMPANY);
        }
        jdbc.update("INSERT INTO sys11_relate_file (sys11_relate_file_id, sys11_file_id, sys11_parent_id, sys11_parent_table) VALUES (900000000000003, ?, 900000000000004, 'tdm43_manl')", orphan);
        jdbc.update("INSERT INTO sys11_relate_file (sys11_relate_file_id, sys11_file_id, sys11_parent_id) VALUES (900000000000005, ?, 900000000000006)", noTable);
        jdbc.update("INSERT INTO sys11_relate_file (sys11_relate_file_id, sys11_file_id, sys11_parent_id) VALUES (900000000000007, ?, ?)", own, COMPANY);
        assertThat(relateFileService.checkFileDelete(none, COMPANY).status()).isEqualTo(3);        // 연결 없음
        assertThat(relateFileService.checkFileDelete(orphan, COMPANY).status()).isEqualTo(3);      // 점검항목이 없는(고아) 연결은 막지 않는다
        assertThat(relateFileService.checkFileDelete(noTable, COMPANY).status()).isEqualTo(2);     // 부모 테이블이 없는 연결은 사용 중
        assertThat(relateFileService.checkFileDelete(own, COMPANY).status()).isEqualTo(1);         // 이 parentId의 연결이면 연결만 지운다
    }
}
