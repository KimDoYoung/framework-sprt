package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsManagerService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** H10 법규 관리그룹 등록(Ics02_Tab_Manager·Ics04_Page_Share)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsManagerService.class)
class IcsManagerDbTest {

    @Autowired IcsManagerService service;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ADMIN = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    /** 다른 회사 관리그룹은 못 건드린다 */
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-1L).companyId(1L).build();

    @Test
    void 관리그룹은_등록하고_이름을_고치고_지운다() {
        List<IcsManagerRes> created = service.save(ADMIN, List.of(new IcsManagerSaveReq(-1L, "H10시험그룹")));
        assertThat(created).hasSize(1);
        long id = created.get(0).managerId();
        assertThat(id).isPositive();
        assertThat(created.get(0).managerGroupName()).isEqualTo("H10시험그룹");
        assertThat(created.get(0).defaultYn()).isFalse();

        service.save(ADMIN, List.of(new IcsManagerSaveReq(id, "H10시험그룹2")));
        assertThat(service.search(ADMIN)).anyMatch(m -> m.managerId() == id && "H10시험그룹2".equals(m.managerGroupName()));

        assertThat(service.inUse(List.of(id))).isFalse();
        assertThatThrownBy(() -> service.save(OTHER, List.of(new IcsManagerSaveReq(id, "남의그룹")))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(OTHER, List.of(id))).isZero();
        assertThat(service.delete(ADMIN, List.of(id))).isEqualTo(1);
        assertThat(service.search(ADMIN)).noneMatch(m -> m.managerId() == id);
    }

    @Test
    void 법규에_연결된_관리그룹은_사용중이다() {
        Long used = jdbc.queryForObject("select ics05_manager_id from ics05_relate_manager limit 1", Long.class);
        assertThat(service.inUse(List.of(used))).isTrue();
    }

    @Test
    void 공유_부서는_관리그룹에_더하고_지운다() {
        long managerId = service.save(ADMIN, List.of(new IcsManagerSaveReq(-1L, "H10공유시험"))).get(0).managerId();
        Long orgId = jdbc.queryForObject("select ics04_org_id from ics04_share where ics04_org_id is not null limit 1", Long.class);

        List<IcsShareRes> saved = service.saveShares(ADMIN, managerId, List.of(new IcsShareSaveReq(-1L, "2", orgId)));
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).shareCode()).isEqualTo("2");
        assertThat(saved.get(0).orgId()).isEqualTo(orgId);
        assertThat(saved.get(0).companyId()).isEqualTo(28000L);
        assertThat(service.searchShares(ADMIN, managerId)).hasSize(1);

        assertThatThrownBy(() -> service.saveShares(OTHER, managerId, List.of(new IcsShareSaveReq(-1L, "2", orgId))))
                .isInstanceOf(BusinessException.class);
        assertThat(service.deleteShares(ADMIN, managerId, List.of(saved.get(0).shareId()))).isEqualTo(1);
        assertThat(service.searchShares(ADMIN, managerId)).isEmpty();
    }
}
