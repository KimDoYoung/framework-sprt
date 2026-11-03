package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpMailFormReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpMailFormRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpSetupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AssetERP 기본설정 Biz50_Lookup_ErpSetup·Biz50_Lookup_MailMapping (EE22) — AS-IS server/biz/Biz50_ErpSetup.
 * biz50_erp_setup 에는 적용시작일별 기본값 행 말고 특수 행이 둘 있다: 메모(note_yn 'true')와 사용료청구 메일양식(적용시작일 없음, note_yn 비어 있음).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizErpSetupService {

    private final BizErpSetupMapper mapper;

    /** biz.Biz50_ErpSetup.selectAll (L24) — 메모·메일양식 행 제외, 적용시작일 내림차순 */
    public List<BizErpSetupRes> search(UserPrincipal user) {
        return mapper.selectAll(user.getCompanyId());
    }

    /** biz.Biz50_ErpSetup.selectByStartDate (L32) — 기준일 이전에 시작한 가장 가까운 기본설정, 없으면 null (사용료 창의 첫 [등록]이 쓴다) */
    public BizErpSetupRes current(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectByStartDate(user.getCompanyId(), stdDate);
    }

    /** biz.Biz50_ErpSetup.update (L90) — UpdateDataModel: 번호가 이미 있으면 UPDATE, 없거나 0 이하면 새 번호로 INSERT → 저장한 행 */
    @Transactional
    public List<BizErpSetupRes> save(List<BizErpSetupSaveReq> rows) {
        List<BizErpSetupRes> saved = new ArrayList<>();
        for (BizErpSetupSaveReq req : rows) {
            long id = req.erpSetupId() == null || req.erpSetupId() <= 0 ? mapper.selectNextId() : req.erpSetupId();
            BizErpSetupSaveReq r = new BizErpSetupSaveReq(id, req.startDate(), req.smsBaseCount(), req.smsAddPrice(), req.serverBaseUsage(),
                    req.serverAddUnit(), req.serverAddPrice(), req.chargeDay(), req.vatCd(), req.userBaseCount(), req.userAddPrice(), req.depositDueDay());
            if (mapper.countById(id) > 0) {
                mapper.updateErpSetup(r);
            } else {
                mapper.insertErpSetup(r);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** biz.Biz50_ErpSetup.delete (L95) → 지운 건수 */
    @Transactional
    public int delete(List<Long> erpSetupIds) {
        int n = 0;
        for (Long id : erpSetupIds) {
            n += mapper.deleteById(id);
        }
        return n;
    }

    /** biz.Biz50_ErpSetup.getNote (L59) — 메모가 없으면 null */
    public String note() {
        return mapper.selectNote();
    }

    /** biz.Biz50_ErpSetup.updateNote (L67) — 메모 행이 있으면 UPDATE, 없으면 INSERT */
    @Transactional
    public void saveNote(String note) {
        mapper.upsertNote(note);
    }

    /** biz.Biz50_ErpSetup.selectMailForm (L51) — 메일양식 행, 아직 없으면 null */
    public BizErpMailFormRes mailForm() {
        return mapper.selectMailForm();
    }

    /** biz.Biz50_ErpSetup.insertMailForm (L76) — 번호가 없으면 새 메일양식 행을 만든다(UpdateDataModel: 있으면 UPDATE, 없으면 INSERT) → 저장한 행 */
    @Transactional
    public BizErpMailFormRes saveMailForm(BizErpMailFormReq req) {
        long id = req.erpSetupId() == null || req.erpSetupId() <= 0 ? mapper.selectNextId() : req.erpSetupId();
        if (mapper.countById(id) > 0) {
            mapper.updateMailForm(id, req.mailForm());
        } else {
            mapper.insertMailForm(id, req.mailForm());
        }
        return new BizErpMailFormRes(id, req.mailForm());
    }
}
