package kr.co.kfs.asseterp.biz.fbx;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxRes;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxSaveReq;
import kr.co.kfs.asseterp.biz.fbx.service.FbxBoxService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * #1116 파일등록 — 원본 2026-11-04(CH-0021~0024·0090·0092·0165): 보관함 제목·비고·등록일을 고치면 변경 기록(06·07·08)을 남기고
 * 그리드에 마지막 변경일시·변경자·부서, 파일이 있는 보관함은 삭제 불가. asseterpdb에서 돌리고 롤백한다
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FbxBoxService.class)
class FbxBoxHistoryDbTest {

    @Autowired FbxBoxService service;
    @Autowired JdbcTemplate jdbc;
    @Autowired org.apache.ibatis.session.SqlSession sqlSession;
    @MockitoBean EmpTransInfoService transInfoService;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();

    @BeforeEach
    void org() {
        TransInfoRes info = Mockito.mock(TransInfoRes.class);
        when(info.orgCodeId()).thenReturn(1L);
        when(transInfoService.getCurrentTransInfo(any(), any())).thenReturn(info);
    }

    @Test
    void 제목과_등록일을_고치면_바뀌기_전_값으로_기록하고_그리드에_마지막_변경이_보인다() {
        FbxBoxRes box = service.update(user, List.of(new FbxBoxSaveReq(null, LocalDateTime.of(2026, 11, 1, 0, 0), "기록 시험", null, "01"))).get(0);
        assertThat(box.actDate()).isNull();

        FbxBoxRes saved = service.update(user, List.of(new FbxBoxSaveReq(box.boxId(), LocalDateTime.of(2026, 11, 2, 0, 0), "기록 시험2", null, "01"))).get(0);
        List<Map<String, Object>> hist = jdbc.queryForList(
                "select fbx02_act_cd, fbx02_act_content from fbx02_history where fbx02_box_id = ? order by fbx02_act_cd", box.boxId());
        assertThat(hist).extracting(m -> m.get("fbx02_act_cd")).containsExactly("06", "08");   // 비고는 그대로라 07 없음
        assertThat(hist).extracting(m -> m.get("fbx02_act_content")).containsExactly("(변경전) 기록 시험", "(변경전) 2026-11-01");
        assertThat(saved.actDate()).isNotNull();
        assertThat(saved.actEmpName()).isNotBlank();

        sqlSession.clearCache();
        assertThat(service.search(user, "기록 시험2")).extracting(FbxBoxRes::actEmpName).containsOnly(saved.actEmpName());
    }

    @Test
    void 파일이_있는_보관함은_지울_수_없다() {
        Long withFiles = jdbc.queryForObject("select fbx01_box_id from fbx01_box where fbx01_company_id = 28000 and fbx01_crt_emp_id = 29049"
                + " and exists (select 1 from fbx03_file where fbx03_box_id = fbx01_box_id) limit 1", Long.class);
        assertThatThrownBy(() -> service.delete(user, List.of(withFiles))).isInstanceOf(BusinessException.class).hasMessageContaining("등록된 파일이 존재합니다");

        FbxBoxRes empty = service.update(user, List.of(new FbxBoxSaveReq(null, LocalDateTime.now(), "빈 보관함", null, "01"))).get(0);
        assertThat(service.delete(user, List.of(empty.boxId()))).isEqualTo(1);
    }
}
