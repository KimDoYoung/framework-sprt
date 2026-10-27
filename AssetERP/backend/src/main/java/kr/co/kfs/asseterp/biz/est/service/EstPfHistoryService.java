package kr.co.kfs.asseterp.biz.est.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfConfirmerRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFileRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFileSaveReq;
import kr.co.kfs.asseterp.biz.est.dto.PfHistoryRes;
import kr.co.kfs.asseterp.biz.est.dto.PfHistorySaveReq;
import kr.co.kfs.asseterp.biz.est.mapper.EstPfHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/est/Est03_PfHistory.java (selectByPfContractId L27 / getConfirmerParent L88 / modelUpdate L114 / delete L151) + Est04_PfFile.java (selectByPfHistoryId L22 / update L28 / delete L33) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstPfHistoryService {

    private final EstPfHistoryMapper mapper;

    /** AS-IS selectByPfContractId: 수행번호 순 */
    public List<PfHistoryRes> search(UserPrincipal user, Long pfContractId) {
        return mapper.selectByPfContractId(user.getCompanyId(), pfContractId);
    }

    /** AS-IS dbConfig.getSeq: [등록] 행의 수행번호ID, [행 추가] 증빙 행의 ID. DB에는 쓰지 않는다. 시퀀스는 읽기 전용 트랜잭션에서 못 돈다 */
    @Transactional
    public Long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS getConfirmerParent: 로그인 사용자의 승인자(조직장). 오늘 기준 */
    public PfConfirmerRes confirmerParent(UserPrincipal user, LocalDate date) {
        return mapper.selectConfirmerParent(user.getUserId(), date);
    }

    /** AS-IS Est04_PfFile.selectByPfHistoryId */
    public List<PfFileRes> searchFiles(UserPrincipal user, Long pfHistoryId) {
        return mapper.selectFilesByPfHistoryId(pfHistoryId, user.getCompanyId());
    }

    /**
     * AS-IS Est04_Grid_PfFile.updateChk(증빙 저장·삭제) → Est03_PfHistory.modelUpdate 순서를 한 트랜잭션으로 묶었다.
     * 같은 용역계약에 같은 수행번호가 있으면 "이미 사용중인 수행번호입니다"(원본은 증빙을 먼저 저장해 두고 이 검사에서 멈춘다).
     * 번호가 DB에 있으면 UPDATE, 없으면 INSERT(회사 = 로그인 회사) → 저장된 행
     */
    @Transactional
    public PfHistoryRes save(UserPrincipal user, PfHistorySaveReq req) {
        Long id = req.pfHistoryId() == null ? mapper.selectNextId() : req.pfHistoryId();
        PfHistorySaveReq withId = new PfHistorySaveReq(id, req.pfContractId(), req.no(), req.startDate(), req.closeDate(), req.content(), req.detail(),
                req.personId(), req.statusCode(), req.confirmerId(), req.files(), req.deleteFileIds());

        if (!mapper.selectSameNoIds(withId.pfContractId(), withId.no(), id).isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 사용중인 수행번호입니다");
        }

        if (mapper.selectById(id, user.getCompanyId()) != null) {
            mapper.updatePfHistory(user.getCompanyId(), withId);
        } else {
            mapper.insertPfHistory(user.getCompanyId(), withId);
        }

        if (req.deleteFileIds() != null && !req.deleteFileIds().isEmpty()) {
            mapper.deletePfFiles(id, req.deleteFileIds());
        }
        if (req.files() != null) {
            for (PfFileSaveReq file : req.files()) {
                if (mapper.countPfFile(file.pfFileId()) > 0) {
                    mapper.updatePfFile(id, file);
                } else {
                    mapper.insertPfFile(id, file);
                }
            }
        }
        return mapper.selectById(id, user.getCompanyId());
    }

    /** AS-IS deleteModel: 체크한 행을 지운다(로그인 회사 행만). 증빙(est04)은 원본도 그대로 둔다 */
    @Transactional
    public void delete(UserPrincipal user, List<Long> pfHistoryIds) {
        if (pfHistoryIds == null || pfHistoryIds.isEmpty()) {
            return;
        }
        mapper.deletePfHistories(user.getCompanyId(), pfHistoryIds);
    }

    /** AS-IS selectByConfirmer01(Q11 일자기준): 검색어는 클라이언트가 "%…%"로 감싼다. 승인자 = 로그인 사용자 */
    public List<PfHistoryRes> searchByConfirmer(UserPrincipal user, LocalDate startDate, String searchText, boolean confirm) {
        return mapper.selectByConfirmer01(user.getCompanyId(), user.getUserId(), startDate, "%" + (searchText == null ? "" : searchText) + "%", confirm);
    }

    /** AS-IS selectByConfirmer02(Q11 체결용역 기준) */
    public List<PfHistoryRes> searchByConfirmerContract(UserPrincipal user, Long pfContractId) {
        return mapper.selectByConfirmer02(user.getCompanyId(), user.getUserId(), pfContractId);
    }

    /** AS-IS updateConfirm: confirm이 true면 상태 20(승인)·승인일시 지금, false면 상태 10(신청)·승인일시 비움 */
    @Transactional
    public void updateConfirm(UserPrincipal user, Long pfHistoryId, boolean confirm) {
        mapper.updateConfirm(user.getCompanyId(), pfHistoryId, confirm ? "20" : "10", confirm);
    }
}
