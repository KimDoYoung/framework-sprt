package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsFormFileRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateFileRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsClassTreeService;
import kr.co.kfs.asseterp.biz.ics.service.IcsLawService;
import kr.co.kfs.asseterp.biz.ics.service.IcsRelateFileService;
import kr.co.kfs.asseterp.biz.ics.service.IcsRevisionHistoryService;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateIcsRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlRelateIcsService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E01 법규관리(관리자)의 조회창들: 상세내용·개정이력·서식파일·연결책무를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcsClassTreeService.class, IcsLawService.class, IcsRevisionHistoryService.class, IcsRelateFileService.class, TdmManlRelateIcsService.class})
class IcsLookupDbTest {

    @Autowired IcsClassTreeService treeService;
    @Autowired IcsLawService lawService;
    @Autowired IcsRevisionHistoryService revisionService;
    @Autowired IcsRelateFileService relateFileService;
    @Autowired TdmManlRelateIcsService tdmService;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal company = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private IcsLawRes newLaw() {
        ClassTreeRes root = treeService.create(admin, new ClassTreeSaveReq(0L, "ZT900", "시험분류", null));
        return lawService.save(admin, List.of(new IcsLawSaveReq(-1L, root.classTreeId(), "ZT900-01", "시험법규", "제출처", "제1조", "false"))).get(0);
    }

    @Test
    void 상세내용_저장은_그_행의_편집_열도_함께_저장한다() {
        IcsLawRes law = newLaw();
        IcsLawRes saved = lawService.updateContent(admin, law.classTreeId(),
                new IcsLawContentReq("상세내용\n둘째 줄", "ZT900-02", "고친법규", "제출처2", "제2조", "true"));
        assertThat(saved.content()).isEqualTo("상세내용\n둘째 줄");
        assertThat(saved.classTreeCode()).isEqualTo("ZT900-02");
        assertThat(saved.advisYn()).isEqualTo("true");
        assertThatThrownBy(() -> lawService.updateContent(company, law.classTreeId(), new IcsLawContentReq("x", "c", "n", null, null, "false")))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lawService.updateContent(admin, law.classTreeId(), new IcsLawContentReq("x", "c", "", null, null, "false")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("법규 내용");
    }

    @Test
    void 개정이력은_연결된_법규의_개정내역을_등록일_내림차순으로_준다() {
        List<IcsRevisionHistoryRes> rows = revisionService.searchByClassTreeId(24762L);
        assertThat(rows).hasSize(3);
        assertThat(rows).extracting(IcsRevisionHistoryRes::regDate).isSortedAccordingTo(java.util.Comparator.reverseOrder());
        assertThat(rows.get(0).title()).isNotBlank();
        assertThat(rows.get(0).fileCount()).isNotNull();
        assertThat(revisionService.searchByClassTreeId(-1L)).isEmpty();
    }

    @Test
    void 서식파일은_불러오기_목록에서_연결하고_연결만_지운다() {
        IcsLawRes law = newLaw();
        List<IcsFormFileRes> forms = relateFileService.searchFormFiles("");
        assertThat(forms).isNotEmpty();
        assertThat(relateFileService.searchFormFiles("없는서식파일이름ZZZ")).isEmpty();
        Long fileId = forms.get(0).fileId();

        assertThat(relateFileService.searchByParentId(law.classTreeId())).isEmpty();
        assertThat(relateFileService.insert(admin, law.classTreeId(), List.of(fileId))).isEqualTo(1);
        assertThat(relateFileService.insert(admin, law.classTreeId(), List.of(fileId))).isZero(); // 이미 연결 → 건너뜀
        List<IcsRelateFileRes> related = relateFileService.searchByParentId(law.classTreeId());
        assertThat(related).hasSize(1);
        assertThat(related.get(0).fileName()).isEqualTo(forms.get(0).fileName());
        assertThat(lawService.refresh(admin, law.classTreeId()).fileCount()).isEqualTo("1건");

        assertThat(relateFileService.delete(admin, law.classTreeId(), List.of(related.get(0).relateFileId()))).isEqualTo(1);
        assertThat(relateFileService.searchByParentId(law.classTreeId())).isEmpty();
        assertThat(relateFileService.searchFormFiles("")).hasSize(forms.size()); // 파일 자체는 그대로
        assertThatThrownBy(() -> relateFileService.insert(company, law.classTreeId(), List.of(fileId))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 연결책무는_관리자_회사에서만_보이고_연결_추가_제거가_된다() {
        List<ManlRelateIcsRes> rows = tdmService.searchByIcsId(admin, 24763L, "");
        assertThat(rows).isNotEmpty();
        assertThat(rows.get(0).taskCheckItem()).startsWith("(");
        assertThat(tdmService.searchByIcsId(company, 24763L, "")).isEmpty();

        IcsLawRes law = newLaw();
        List<ManlRes> candidates = tdmService.searchExceptIcsId(admin, law.classTreeId(), "");
        assertThat(candidates).isNotEmpty();
        ManlRes first = candidates.get(0);
        assertThat(first.checkItemAddCode()).startsWith("(" + first.manlCode() + ") ");

        assertThat(tdmService.insertList(admin, law.classTreeId(), List.of(first.manlId()))).isEqualTo(1);
        assertThat(tdmService.insertList(admin, law.classTreeId(), List.of(first.manlId()))).isZero();
        List<ManlRelateIcsRes> linked = tdmService.searchByIcsId(admin, law.classTreeId(), "");
        assertThat(linked).extracting(ManlRelateIcsRes::manlId).containsExactly(first.manlId());
        assertThat(tdmService.searchExceptIcsId(admin, law.classTreeId(), "")).extracting(ManlRes::manlId).doesNotContain(first.manlId());
        assertThat(lawService.refresh(admin, law.classTreeId()).tdmCount()).isEqualTo("1건");

        assertThat(tdmService.delete(admin, law.classTreeId(), List.of(linked.get(0).manlRelateIcsId()))).isEqualTo(1);
        assertThat(tdmService.searchByIcsId(admin, law.classTreeId(), "")).isEmpty();
        assertThatThrownBy(() -> tdmService.insertList(company, law.classTreeId(), List.of(first.manlId()))).isInstanceOf(BusinessException.class);
    }
}
