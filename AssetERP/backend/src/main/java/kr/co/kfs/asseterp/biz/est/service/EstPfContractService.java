package kr.co.kfs.asseterp.biz.est.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfContractRes;
import kr.co.kfs.asseterp.biz.est.dto.PfContractSaveReq;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfContractMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/est/Est02_PfContract.java (selectByText L27 / modelUpdate L68 / delete L86) + Est03_PfHistory.checkList L77 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstPfContractService {

    private final EstPfContractMapper mapper;

    /** AS-IS selectByText: 검색어는 클라이언트가 "%…%"로 감싼다(차주명/사업자명/수수료명), 조회기준일에 수행 중인 계약만 */
    public List<PfContractRes> search(UserPrincipal user, LocalDate startDate, String searchText) {
        return mapper.selectByText(user.getCompanyId(), startDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS dbConfig.getSeq: 등록 창을 열 때 받는 새 번호(첨부파일을 먼저 올리려고). DB에는 쓰지 않는다. 시퀀스(nextval)는 읽기 전용 트랜잭션에서 못 돈다 */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS modelUpdate: 번호가 DB에 있으면 UPDATE, 없으면 INSERT(회사 = 로그인 회사) → 저장된 행 */
    @Transactional
    public PfContractRes save(UserPrincipal user, PfContractSaveReq req) {
        Long id = req.pfContractId() == null ? mapper.selectNextId() : req.pfContractId();
        PfContractSaveReq withId = new PfContractSaveReq(id, req.borrower(), req.projectSiteName(), req.projectSiteAddr(), req.pfFeeTypeId(),
                req.startDate(), req.closeDate(), req.managerId(), req.plan());
        if (mapper.selectById(id, user.getCompanyId()) != null) {
            mapper.updatePfContract(user.getCompanyId(), withId);
        } else {
            mapper.insertPfContract(user.getCompanyId(), withId);
        }
        return mapper.selectById(id, user.getCompanyId());
    }

    /** AS-IS deleteModel: 체크한 행을 지운다(로그인 회사 행만) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> pfContractIds) {
        if (pfContractIds == null || pfContractIds.isEmpty()) {
            return;
        }
        mapper.deletePfContracts(user.getCompanyId(), pfContractIds);
    }

    /** AS-IS Est03_PfHistory.checkList: 이 용역계약들의 수행내역 건수 (0이면 수정·삭제 제한 없음) */
    public int countHistories(List<Long> pfContractIds) {
        if (pfContractIds == null || pfContractIds.isEmpty()) {
            return 0;
        }
        return mapper.selectHistoryIdsByContracts(pfContractIds).size();
    }

    /** AS-IS selectById: 로그인 회사 행만 */
    public PfContractRes get(UserPrincipal user, Long pfContractId) {
        return mapper.selectById(pfContractId, user.getCompanyId());
    }
}
