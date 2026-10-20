package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestMyReq;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsUserRequestService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** H11 법규등록신청(Ics17_Tab_UserRequest)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsUserRequestService.class)
class IcsUserRequestDbTest {

    @Autowired IcsUserRequestService service;

    private static final UserPrincipal USER = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    /** 다른 회사의 신청은 못 고치고 못 지운다 */
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-1L).companyId(1L).build();

    private static UserRequestMyReq req(String title) {
        return new UserRequestMyReq("2026-10-20", "false", title, "H11 법규내용", "매월", "금융감독원", "제3조");
    }

    @Test
    void 신청은_등록하고_고치고_지운다() {
        UserRequestRes created = service.create(USER, req("H11시험"));
        long id = created.userRequestId();
        assertThat(id).isPositive();
        assertThat(created.companyId()).isEqualTo(28000L);
        assertThat(created.personId()).isEqualTo(-28656L);
        assertThat(created.regDate()).isEqualTo("2026-10-20");
        assertThat(created.confirmYn()).isEqualTo("false");

        UserRequestRes updated = service.update(USER, id, new UserRequestMyReq("2026-10-19", "true", "H11시험2", "내용2", "분기", "보고처2", "제4조"));
        assertThat(updated.lawTitle()).isEqualTo("H11시험2");
        assertThat(updated.confirmYn()).isEqualTo("true");
        assertThat(updated.reportCycle()).isEqualTo("분기");

        assertThat(service.search(USER, "2026-01-01", "2026-12-31", "%", false, "H11시험2")).anyMatch(r -> r.userRequestId() == id);
        assertThat(service.search(USER, "2026-01-01", "2026-12-31", "%", true, "H11시험2")).noneMatch(r -> r.userRequestId() == id);
        assertThat(service.search(OTHER, "2026-01-01", "2026-12-31", "%", false, "H11시험2")).noneMatch(r -> r.userRequestId() == id);

        assertThatThrownBy(() -> service.update(OTHER, id, req("남의신청"))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(OTHER, id)).isZero();
        assertThat(service.delete(USER, id)).isEqualTo(1);
    }

    @Test
    void 요청일자가_없으면_저장하지_않는다() {
        assertThatThrownBy(() -> service.create(USER, new UserRequestMyReq(null, "false", "t", null, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("요청일자");
    }
}
