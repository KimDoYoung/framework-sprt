package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.JournalMapRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalMapSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.TrMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.TrMapRes;
import kr.co.kfs.asseterp.biz.act.dto.TrMapSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActJournalMapService;
import kr.co.kfs.asseterp.biz.act.service.ActTrMapService;
import kr.co.kfs.asseterp.biz.ast.dto.TrCodeRes;
import kr.co.kfs.asseterp.biz.ast.service.AstTrCodeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** E30(거래유형별 분개맵핑)의 쓰기·기초데이터생성·거래유형 조회창 조회를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ActTrMapService.class, ActJournalMapService.class, AstTrCodeService.class})
class ActTrMapDbTest {

    @Autowired ActTrMapService trMapService;
    @Autowired ActJournalMapService journalService;
    @Autowired AstTrCodeService trCodeService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 거래맵핑_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from act11_tr_map where act11_company_id = 0", Integer.class);
        assertThat(trMapService.search(admin, null, null)).hasSize(all);
        assertThat(trMapService.search(admin, "", "")).hasSize(all);

        TrMapRes created = trMapService.update(admin, List.of(new TrMapSaveReq(-1L, "1001", "ZT0001", "1", null, "true", "시험"))).get(0);
        assertThat(created.trMapId()).isPositive();
        assertThat(created.companyId()).isZero();
        assertThat(created.trName()).isNotBlank();           // ast05_tr_nm (JOIN)
        assertThat(created.bookIoTypeName()).isNotBlank();   // f_cdnm
        assertThat(trMapService.search(admin, null, null)).hasSize(all + 1);
        assertThat(trMapService.search(admin, "1001", "zt00")).hasSize(0);   // 분개그룹 LIKE는 대소문자를 가린다(원본 SQL)
        assertThat(trMapService.search(admin, "1001", "ZT00")).extracting(TrMapRes::journalGroup).containsExactly("ZT0001");

        // 손익대표계정: 같은 회사의 코드를 가리키면 이름이 따라온다
        String repr = jdbc.queryForObject("select act10_repr_account_cd from act10_repr_account where act10_company_id = 0 order by 1 limit 1", String.class);
        TrMapRes updated = trMapService.update(admin, List.of(new TrMapSaveReq(created.trMapId(), "1001", "ZT0001", "2", repr, "false", null))).get(0);
        assertThat(updated.bookIoType()).isEqualTo("2");
        assertThat(updated.plReprAccountCode()).isEqualTo(repr);
        assertThat(updated.plReprAccountName()).isNotBlank();
        assertThat(updated.useYn()).isEqualTo("false");

        // 거래코드 필수 — 화면 update() 문구 그대로
        assertThatThrownBy(() -> trMapService.update(admin, List.of(new TrMapSaveReq(null, "", "ZT0001", null, null, "true", null)))).hasMessageContaining("거래코드는 필수입력 항목입니다.");

        // 다른 회사는 관리자 회사 행을 고치지도 지우지도 못한다
        assertThatThrownBy(() -> trMapService.update(other, List.of(new TrMapSaveReq(created.trMapId(), "1001", "ZT0001", "1", null, "true", "침범")))).isInstanceOf(BusinessException.class);
        assertThat(trMapService.delete(other, List.of(created.trMapId()))).isZero();

        assertThat(trMapService.delete(admin, List.of(created.trMapId()))).isEqualTo(1);
        assertThat(trMapService.delete(admin, List.of())).isZero();
        assertThat(trMapService.search(admin, null, null)).hasSize(all);
    }

    @Test
    void 분개맵핑_조회_등록_수정_삭제() {
        String group = jdbc.queryForObject("select act12_journal_group from act12_journal_map where act12_company_id = 0 order by 1 limit 1", String.class);
        int inGroup = jdbc.queryForObject("select count(*) from act12_journal_map where act12_company_id = 0 and act12_journal_group = ?", Integer.class, group);
        assertThat(journalService.search(admin, group)).hasSize(inGroup);

        String repr = jdbc.queryForObject("select act10_repr_account_cd from act10_repr_account where act10_company_id = 0 order by 1 limit 1", String.class);
        JournalMapRes created = journalService.update(admin, List.of(new JournalMapSaveReq(-1L, "ZT0001", 1L, repr, "D", "amt", null, "시험", "true"))).get(0);
        assertThat(created.journalMapId()).isPositive();
        assertThat(created.reprAccountName()).isNotBlank();   // act10 JOIN
        assertThat(created.drcrTypeName()).isNotBlank();      // f_cdnm
        assertThat(journalService.search(admin, "ZT0001")).extracting(JournalMapRes::seq).containsExactly(1L);

        JournalMapRes updated = journalService.update(admin, List.of(new JournalMapSaveReq(created.journalMapId(), "ZT0001", 2L, repr, "C", "amt*2", "for", "시험2", "false"))).get(0);
        assertThat(updated.seq()).isEqualTo(2L);
        assertThat(updated.drcrType()).isEqualTo("C");
        assertThat(updated.forFormula()).isEqualTo("for");

        // 필수 4종 — 화면 preUpdate() 문구와 순서 그대로
        assertThatThrownBy(() -> journalService.update(admin, List.of(new JournalMapSaveReq(null, "", 1L, repr, "1", null, null, null, "true")))).hasMessageContaining("분개그룹은 필수입력 항목입니다.");
        assertThatThrownBy(() -> journalService.update(admin, List.of(new JournalMapSaveReq(null, "ZT0001", null, repr, "1", null, null, null, "true")))).hasMessageContaining("순번은 필수입력 항목입니다.");
        assertThatThrownBy(() -> journalService.update(admin, List.of(new JournalMapSaveReq(null, "ZT0001", 1L, null, "1", null, null, null, "true")))).hasMessageContaining("대표계정코드는 필수입력 항목입니다.");
        assertThatThrownBy(() -> journalService.update(admin, List.of(new JournalMapSaveReq(null, "ZT0001", 1L, repr, null, null, null, null, "true")))).hasMessageContaining("차대구분은 필수입력 항목입니다.");

        assertThatThrownBy(() -> journalService.update(other, List.of(new JournalMapSaveReq(created.journalMapId(), "ZT0001", 1L, repr, "1", null, null, "침범", "true")))).isInstanceOf(BusinessException.class);
        assertThat(journalService.delete(other, List.of(created.journalMapId()))).isZero();
        assertThat(journalService.delete(admin, List.of(created.journalMapId()))).isEqualTo(1);
        assertThat(journalService.search(admin, "ZT0001")).isEmpty();
    }

    @Test
    void 기초데이터생성은_고객사의_같은_거래맵핑과_분개그룹_전체를_지우고_관리자_회사_것을_복사() {
        // 분개맵핑이 둘 이상 있는 분개그룹을 고른다
        var row = jdbc.queryForMap("select act11_tr_cd tr, act11_journal_group g from act11_tr_map where act11_company_id = 0 and act11_journal_group in "
                + "(select act12_journal_group from act12_journal_map where act12_company_id = 0 group by 1 having count(*) > 1) order by 1, 2 limit 1");
        String trCode = (String) row.get("tr");
        String group = (String) row.get("g");
        Long target = 28000L;
        int jnl0 = jdbc.queryForObject("select count(*) from act12_journal_map where act12_company_id = 0 and act12_journal_group = ?", Integer.class, group);
        TrMapInitReq req = new TrMapInitReq(List.of(target), List.of(new TrMapInitReq.Item(trCode, group)));

        assertThat(trMapService.insertInitData(admin, req)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from act11_tr_map where act11_company_id = ? and act11_tr_cd = ? and act11_journal_group = ?", Integer.class, target, trCode, group)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from act12_journal_map where act12_company_id = ? and act12_journal_group = ?", Integer.class, target, group)).isEqualTo(jnl0);
        // 두 번 해도 같다 (지우고 다시 넣는다)
        trMapService.insertInitData(admin, req);
        assertThat(jdbc.queryForObject("select count(*) from act11_tr_map where act11_company_id = ? and act11_tr_cd = ? and act11_journal_group = ?", Integer.class, target, trCode, group)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from act12_journal_map where act12_company_id = ? and act12_journal_group = ?", Integer.class, target, group)).isEqualTo(jnl0);

        // 선택한 행이 없으면 아무 것도 안 하고 성공(원본: "생성이 완료되었습니다.")
        assertThat(trMapService.insertInitData(admin, new TrMapInitReq(List.of(target), List.of()))).isEqualTo(1);
        // 관리자만
        assertThatThrownBy(() -> trMapService.insertInitData(other, req)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 거래유형_조회창은_사용_중인_코드만_수령지급과_자산구분으로_좁힌다() {
        int all = jdbc.queryForObject("select count(*) from ast05_tr_code where ast05_company_id = 0 and ast05_asset_type like '1' and coalesce(ast05_use_yn,'true') = 'true'", Integer.class);
        List<TrCodeRes> list = trCodeService.lookup(admin, null, null, "1", null);
        assertThat(list).hasSize(all);
        assertThat(list).allSatisfy(r -> assertThat(r.useYn()).isNotEqualTo("false"));
        // 검색어(코드 또는 이름) · 수령/지급
        assertThat(trCodeService.lookup(admin, "1001", "%", "1", null)).extracting(TrCodeRes::trCode).contains("1001");
        String rcvPay = list.get(0).rcvPayCode();
        assertThat(trCodeService.lookup(admin, null, rcvPay, "1", null)).allSatisfy(r -> assertThat(r.rcvPayCode()).isEqualTo(rcvPay));
        // 자산구분이 없으면(원본 Act11 그리드의 직접 호출) 결과가 없다
        assertThat(trCodeService.lookup(admin, null, null, null, null)).isEmpty();
    }
}
