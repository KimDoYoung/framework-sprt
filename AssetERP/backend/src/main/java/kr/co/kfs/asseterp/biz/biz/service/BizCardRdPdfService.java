package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.rd.service.RdFileSaver;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * #1131 이익제공 입력(법인카드) [상신]의 RD 첨부 PDF "(요약) {문서 제목}.pdf" (CH-0112, 사용자 결정 2026-11-11: RD가 만드는 PDF는 TOBE도 RD로).
 * AS-IS: Biz01_Tab_Card.createRd L631 → Sys99_Print.insertRdCardSimple(고른 행 → sys99_print, window Biz01_Tab_Card_Simple)
 *        → RDUtil.download(CommonInvoker.jsp · mrd Biz01_Rd_CardSimple · options "/rpdflinebreak [1]" · pdf · rv rdGroupId·companyId·personId)
 *        → 결재창 저장 때 Apr01_Grid_ApprFile.cardFileSetting L350: checkFileStatus → fileReName(이름 "(요약) " + 제목, pdf).
 * 원본 이상: 파일 이름을 RD 호출 전에 printModel에 넣고(첫 상신은 null) 서버는 groupId만 돌려줘 이름이 "undefined"가 된다
 *        → 첫 상신은 첨부 없음, 그 뒤로는 모두가 같이 쓰는 undefined.pdf가 붙는다(docs/원본-이상한점.md). TOBE는 이번 상신 자료의 PDF를 붙인다.
 * RD가 꺼졌거나 실패하면 첨부 없이 넘어간다(AS-IS 개발계와 같음).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BizCardRdPdfService {

    static final String WINDOW = "Biz01_Tab_Card_Simple";
    static final String MRD = "Biz01_Rd_CardSimple";
    static final String OPTIONS = "/rpdflinebreak [1]";
    private static final String FILE_TYPE = "pdf";

    private final BizPromoMapper mapper;
    private final BizRelateApprMapper relateApprMapper;
    private final RdFileSaver rdFileSaver;
    private final SysFileService sysFileService;

    /** AS-IS Sys99_Print.insertRdCardSimple — 별도 트랜잭션으로 커밋해야 RD 서버(다른 접속)가 읽는다. 돌려주는 값 = 출력 그룹 ID */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public long insertRdCardSimple(UserPrincipal user, List<Long> promoIds) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, WINDOW);
        for (BizPromoCardRes row : mapper.selectByCardIds(companyId, promoIds)) {
            mapper.insertPrintCard(mapper.selectNextId(), companyId, personId, WINDOW, groupId, row);   // string01(마감구분)은 원본도 주석
        }
        return groupId;
    }

    /** @return 첨부한 파일 ID. RD가 꺼졌거나 실패하면 비어 있다 */
    public Optional<Long> attach(UserPrincipal user, long groupId, Long apprId, String titleName) {
        Map<String, String> rv = new LinkedHashMap<>();
        rv.put("rdGroupId", String.valueOf(groupId));
        rv.put("companyId", String.valueOf(user.getCompanyId()));
        rv.put("personId", String.valueOf(user.getUserId()));
        Optional<File> pdf = rdFileSaver.save(user, MRD, OPTIONS, FILE_TYPE, "card_" + groupId, rv);
        if (pdf.isEmpty()) {
            return Optional.empty();
        }
        try {
            String locName = relateApprMapper.selectLocName(user.getCompanyId());
            return Optional.of(sysFileService.registerRdFile(pdf.get(), apprId, locName, "(요약) " + titleName + "." + FILE_TYPE, FILE_TYPE));
        } catch (IOException e) {
            log.error("법인카드 RD PDF 첨부 실패 apprId={}", apprId, e);
            return Optional.empty();
        }
    }
}
