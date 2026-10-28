package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayTaxReceiptMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/** AS-IS server/pay/Pay08_TaxWithholding.java (selectByPersonId L34 / selectByCompanyId L24 / update L45 / delete L50) + 서블릿 FileUpload.uploadPay08 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayTaxReceiptService {

    private final PayTaxReceiptMapper mapper;
    private final SysFileService fileService;

    /** 원천징수영수증(사본)(S24) — AS-IS retrieve() L113: personId = 로그인 사용자. 사원은 서버가 정한다(남의 영수증을 못 본다) */
    public List<PayTaxReceiptRes> searchMine(UserPrincipal user) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId());
    }

    /** 원천징수영수증 업로드(S25) — AS-IS retrieve() L302: 사원을 골랐으면 selectByPersonId, 아니면 selectByCompanyId(로그인 회사) */
    public List<PayTaxReceiptRes> search(UserPrincipal user, Long personId) {
        return personId != null
                ? mapper.selectByCompanyAndPerson(user.getCompanyId(), personId)
                : mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS FileUpload.uploadPay08 L643-690: 파일마다 영수증 행(pay08)을 새로 만들고 그 ID를 부모로 파일을 올린다.
     * 파일 하나 = 요청 하나(여러 파일은 화면이 하나씩 보낸다)
     */
    @Transactional
    public PayTaxReceiptRes upload(UserPrincipal user, MultipartFile file) {
        Long id = mapper.selectNextId();
        mapper.insert(id, user.getCompanyId());
        FileRes saved = fileService.upload(user, id, "pay08", "false", file);
        return new PayTaxReceiptRes(id, null, "-", null, null, saved.fileId(), saved.fileNm(), saved.fileExt());
    }

    /** AS-IS update() L355 → UpdateDataModel: 사원·비고. 다른 회사 행이나 사원이면 404 (TOBE 추가: 사원이 로그인 회사 소속인지) */
    @Transactional
    public int save(UserPrincipal user, List<PayTaxReceiptSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayTaxReceiptSaveReq req : rows) {
            if (mapper.countOwn(companyId, req.taxWithholdingId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (req.personId() != null && mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        rows.forEach(req -> mapper.update(companyId, req));
        return rows.size();
    }

    /** AS-IS GridDeleteData → pay.Pay08_TaxWithholding.delete: 영수증 행. 파일(sys10)은 화면이 먼저 FileDelete로 지운다 */
    @Transactional
    public int delete(UserPrincipal user, Long taxWithholdingId) {
        return mapper.delete(user.getCompanyId(), taxWithholdingId);
    }
}
