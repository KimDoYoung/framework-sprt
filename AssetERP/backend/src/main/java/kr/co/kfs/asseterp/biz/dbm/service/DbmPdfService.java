package kr.co.kfs.asseterp.biz.dbm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dbm.dto.PdfTargetParam;
import kr.co.kfs.asseterp.biz.dbm.dto.PdfTargetRes;
import kr.co.kfs.asseterp.biz.dbm.mapper.DbmPdfMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Dbm10_Tab_MakePdf (apr.Apr01_Appr.selectPdfMakeTarget, utils.pdf.PDFCreate.createPDF7) — 원본에 권한 검사 없음(로그인 회사 기준, 메뉴를 가진 회사만 연다) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DbmPdfService {

    private final DbmPdfMapper mapper;
    private final PdfMaker pdfMaker;

    /** AS-IS retrieve L56-66: companyId = LoginUser.getCompanyId() */
    public List<PdfTargetRes> searchTargets(UserPrincipal user) {
        return mapper.selectPdfMakeTarget(new PdfTargetParam(user.getCompanyId()));
    }

    /** AS-IS update L69-86: createPDF7(keyId, companyId) */
    public void makePdf(UserPrincipal user, Long apprId) {
        pdfMaker.make(user.getCompanyId(), apprId);
    }
}
