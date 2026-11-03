package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpContCorpMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AssetERP 계약사 관리 Biz51_Tab_ErpContCorp (EE22) — AS-IS server/biz/Biz51_ErpContCorp.
 * KFS 가 AssetERP 고객사를 관리하는 표라 로그인 회사로 거르지 않는다(AS-IS 도 같다. 접근은 메뉴 권한으로만 막는다).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizErpContCorpService {

    private final BizErpContCorpMapper mapper;

    /** biz.Biz51_ErpContCorp.selectByContStatusCode (L24) — 검색어는 '%…%', contStatusCode 가 없으면 계약상태를 가리지 않는다 */
    public List<BizErpContCorpRes> search(String contStatusCode, String searchText) {
        return mapper.selectByContStatusCode(contStatusCode == null || contStatusCode.isEmpty() ? null : contStatusCode,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** biz.Biz51_ErpContCorp.selectById (L19) */
    public BizErpContCorpRes get(Long erpContCorpId) {
        BizErpContCorpRes r = mapper.selectById(erpContCorpId);
        if (r == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "AssetERP 계약사를 찾을 수 없습니다.");
        }
        return r;
    }

    /** getSeq (dbConfig.getSeq → f_create_seq()) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** biz.Biz51_ErpContCorp.insertUpdate (L42) — 번호가 없으면 새로 받고, UpdateDataModel 처럼 번호가 이미 있으면 UPDATE·없으면 INSERT */
    @Transactional
    public BizErpContCorpRes save(BizErpContCorpSaveReq req) {
        if (req.corpId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계약사는 필수입력 항목입니다");
        }
        BizErpContCorpSaveReq r = req;
        if (req.erpContCorpId() == null || req.erpContCorpId() <= 0) {
            r = new BizErpContCorpSaveReq(mapper.selectNextId(), req.corpId(), req.contStatusCd(), req.serviceType(), req.firstContDate(), req.contDate(),
                    req.contEndDate(), req.erpStartDate(), req.erpEndDate(), req.companyId(), req.managerNm(), req.managerTel(), req.managerEmail(),
                    req.companyCeo(), req.companyAddr(), req.note());
        }
        if (mapper.countById(r.erpContCorpId()) > 0) {
            mapper.updateErpContCorp(r);
        } else {
            mapper.insertErpContCorp(r);
        }
        return get(r.erpContCorpId());
    }

    /** biz.Biz51_ErpContCorp.deleteList (L56) — 계약사마다 연결 상신문서 → 첨부파일 행 → 사용료 → 계약사 순서로 지운다 → 지운 계약사 수 */
    @Transactional
    public int delete(List<Long> erpContCorpIds) {
        int n = 0;
        for (Long id : erpContCorpIds) {
            mapper.deleteRelateApprByKey(id);
            mapper.deleteFilesByParent(id);
            mapper.deleteFeesByErpContCorp(id);
            n += mapper.deleteById(id);
        }
        return n;
    }
}
