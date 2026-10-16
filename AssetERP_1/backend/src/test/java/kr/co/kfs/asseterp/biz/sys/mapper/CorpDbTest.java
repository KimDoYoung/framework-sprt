package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CorpRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCorpAccountService;
import kr.co.kfs.asseterp.biz.sys.service.SysCorpService;
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

/** A25 거래처 등록·관리(거래처·계좌)를 asseterpdb에서 실제로 돌리고 롤백한다. 없는 회사(99999)로 시험한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCorpService.class, SysCorpAccountService.class})
class CorpDbTest {

    private static final long FAKE = 99999L;

    @Autowired SysCorpService corp;
    @Autowired SysCorpAccountService account;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal fake = UserPrincipal.builder().userId(1L).companyId(FAKE).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(FAKE + 1).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private CorpSaveReq req(Long id, String type, String name, String bizNo, String code) {
        return new CorpSaveReq(id, type, name, bizNo, code, 5L, "true", "비고", "02-1", "주소", null);
    }

    @Test
    void 사업자번호는_하이픈을_넣어_저장하고_코드를_비우면_사업자번호_2자리로_만든다() {
        CorpRes a = corp.update(fake, List.of(req(0L, "0", "가거래처", "1234567890", null))).get(0);
        assertThat(a.bizNo()).isEqualTo("123-45-67890");
        assertThat(a.corpCode()).isEqualTo("123456789001");
        assertThat(a.companyId()).isEqualTo(FAKE);
        assertThat(a.corpAccountCnt()).isEqualTo("0건");
        // 같은 사업자번호로 코드를 또 비우면 02
        CorpRes b = corp.update(fake, List.of(req(-1L, "0", "나거래처", "123-45-67890", ""))).get(0);
        assertThat(b.corpCode()).isEqualTo("123456789002");
    }

    @Test
    void 필수와_자릿수_중복_검사_메시지는_원본과_같다() {
        assertThatThrownBy(() -> corp.update(fake, List.of(req(0L, "", "x", null, null)))).hasMessage("거래처구분을 선택해주세요.");
        assertThatThrownBy(() -> corp.update(fake, List.of(req(0L, "0", "", null, null)))).hasMessage("거래처명을 입력해주세요.");
        assertThatThrownBy(() -> corp.update(fake, List.of(req(0L, "0", "x", "123-45", null))))
                .hasMessage("사업자번호는 10자리('-'제외) 입니다. 확인해주세요.");
        assertThatThrownBy(() -> corp.update(fake, List.of(req(0L, "0", "x", null, "1234567890123"))))
                .hasMessage("거래처코드는 최대 12자리까지 입력해주세요.");
        corp.update(fake, List.of(req(0L, "0", "원본", null, "DUP1")));
        assertThatThrownBy(() -> corp.update(fake, List.of(req(0L, "0", "복사", null, "DUP1"))))
                .hasMessage("동일 거래처코드가 존재합니다. (DUP1)");
        assertThatThrownBy(() -> corp.update(fake, List.of(new CorpSaveReq(0L, "0", "x", null, null, null, "true", null, null, null, "123456"))))
                .hasMessage("발행기관코드는 최대 5자리까지 입력해주세요.");
    }

    @Test
    void 조회는_로그인_회사만_사용_거래처만_보기와_구분_검색어를_거른다() {
        corp.update(fake, List.of(req(0L, "0", "사용거래처", null, "S1"),
                new CorpSaveReq(0L, "3", "미사용거래처", null, "S2", null, "false", null, null, null, null)));
        assertThat(corp.search(fake, "%", "", true)).extracting(CorpRes::corpName).containsExactly("사용거래처");
        assertThat(corp.search(fake, "%", "", false)).hasSize(2);
        assertThat(corp.search(fake, "3", "", false)).extracting(CorpRes::corpName).containsExactly("미사용거래처");
        assertThat(corp.search(fake, "%", "S2", false)).hasSize(1);
        assertThat(corp.search(other, "%", "", false)).isEmpty();
    }

    @Test
    void 남의_회사_거래처는_고칠_수_없다() {
        Long id = corp.update(fake, List.of(req(0L, "0", "내거래처", null, "M1"))).get(0).corpId();
        assertThatThrownBy(() -> corp.update(other, List.of(req(id, "0", "바꿈", null, "M1")))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 계좌는_암호화해_저장하고_복호화해_읽으며_거래처가_다른_회사면_거절() {
        Long id = corp.update(fake, List.of(req(0L, "0", "계좌거래처", null, "A1"))).get(0).corpId();
        CorpAccountRes saved = account.update(fake, id, List.of(new CorpAccountSaveReq(0L, "004", "123-456-789", "예금주", "true"))).get(0);
        assertThat(saved.accountNoDec()).isEqualTo("123-456-789");
        assertThat(jdbc.queryForObject("select sys17_account_no from sys17_corp_account where sys17_corp_account_id=?", String.class, saved.corpAccountId()))
                .isNotEqualTo("123-456-789");
        assertThat(account.search(fake, id)).hasSize(1);
        assertThat(corp.search(fake, "%", "A1", true).get(0).corpAccountCnt()).isEqualTo("1건");
        assertThatThrownBy(() -> account.search(other, id)).isInstanceOf(BusinessException.class);
        // 수정
        CorpAccountRes upd = account.update(fake, id, List.of(new CorpAccountSaveReq(saved.corpAccountId(), "004", "999", "새예금주", "false"))).get(0);
        assertThat(upd.accountNoDec()).isEqualTo("999");
        assertThat(upd.accountName()).isEqualTo("새예금주");
        assertThat(account.delete(fake, id, List.of(saved.corpAccountId()))).isEqualTo(1);
    }

    @Test
    void 삭제는_다른_테이블이_쓰는_거래처가_있으면_아무것도_지우지_않는다() {
        Long a = corp.update(fake, List.of(req(0L, "0", "지울거래처", null, "D1"))).get(0).corpId();
        Long b = corp.update(fake, List.of(req(0L, "0", "계좌있는거래처", null, "D2"))).get(0).corpId();
        account.update(fake, b, List.of(new CorpAccountSaveReq(0L, "004", "1", "x", "false")));
        assertThatThrownBy(() -> corp.delete(fake, List.of(a, b))).hasMessage("사용중인 기관으로 삭제할 수 없습니다. (계좌있는거래처)");
        assertThat(corp.search(fake, "%", "D", false)).hasSize(2);
        assertThat(corp.delete(fake, List.of(a))).isEqualTo(1);
    }

    @Test
    void 기초데이터생성은_관리자만_회사를_꼭_골라야_하고_회사0_거래처를_복사한다() {
        assertThatThrownBy(() -> corp.insertInitData(fake, FAKE)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> corp.insertInitData(sysAdmin, null)).hasMessage("고객사를 선택해주세요");
        Long expected = jdbc.queryForObject("select count(*) from sys15_corp where sys15_company_id=0", Long.class);
        assertThat(corp.insertInitData(sysAdmin, FAKE)).isEqualTo(expected.intValue());
        assertThat(corp.search(fake, "%", "", false)).hasSize(expected.intValue());
    }
}
