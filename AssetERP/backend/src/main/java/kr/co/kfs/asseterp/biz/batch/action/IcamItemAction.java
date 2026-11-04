package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchAssetMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIcamMapper;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpItemSync;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.icamItem (L2254) — 기준일(기본: 직전 영업일)의 ICAM 종목(uzm0ui)을 회사별로 읽어
 * 자산분류(ast01)에 대분류 → 중분류 → 종목 순으로 없는 것만 만든다. 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcamItemAction implements BatchAction {

    private static final String QUERY = "ast01_class_tree.selectIcamItem";

    private final BatchCommonMapper commonMapper;
    private final BatchIcamMapper icamMapper;
    private final BatchAssetMapper assetMapper;
    private final AssetErpItemSync itemSync;
    private final IcamReader icamReader;
    private final BatchNoticeLogService noticeLog;

    @Override
    public String actionCode() {
        return "icamItem";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 종목정보 가져오기 시작 (icamItem) companyId={}, worker={}", req.companyId(), req.worker());

        LocalDate stdDate;
        if (req.stdDate() == null || req.stdDate().isEmpty()) {
            stdDate = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
        } else {
            try {
                stdDate = LocalDate.parse(req.stdDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 진행한다(원본-이상한점 #213)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "stdDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.stdDate());
            }
        }
        String companyId = "ALL".equals(req.companyId()) ? "%" : req.companyId();

        try {
            for (BatchIcamCompany company : icamMapper.selectIcamCompanies(companyId)) {
                log.debug("ICAM 회사코드: {}", company.icamCompanyCode());

                Map<String, Object> param = new HashMap<>();
                param.put("icamCompanyCode", company.icamCompanyCode());
                param.put("stdDate", stdDate == null ? null : stdDate.toString());

                List<IcamRow> rows = icamReader.read(IcamServer.ICAM, QUERY, param);
                if (rows.isEmpty()) {
                    noticeLog.notice(actionCode(), "icamItemList(ast01) size : 0 ", param.toString());
                }

                boolean managerAuto = "true".equals(assetMapper.selectAstManagerAutoYn(company.companyId()));
                Long cid = company.companyId();

                for (IcamRow r : rows) {
                    // 대분류 가져오기 => 없으면 생성
                    Long parentId = assetMapper.selectClassTreeIdByName(cid, 0L, r.getString("ast01_icam_l_nm"));
                    if (parentId == null) {
                        parentId = itemSync.createClass(cid, 0L, r.getString("ast01_icam_l_nm"));
                    }

                    // 중분류 가져오기 => 없으면 생성 (이름이 비면 중분류 없음)
                    String mName = r.getString("ast01_icam_m_nm");
                    if (mName != null) {
                        Long mId = assetMapper.selectClassTreeIdByName(cid, parentId, mName);
                        parentId = mId != null ? mId : itemSync.createClass(cid, parentId, mName);
                    }

                    // 종목코드 가져오기 => 없으면 생성
                    String isin = r.getString("ast01_isin");
                    if (assetMapper.selectClassTreeIdByIsin(cid, parentId, isin) == null) {
                        itemSync.createItem(cid, parentId, r.getString("ast01_class_tree_nm"), isin,
                                r.getString("ast01_icam_l_cd"), r.getString("ast01_icam_s_cd"), managerAuto, stdDate);
                    }
                }
            }
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "ITEM 작업완료..commit";
    }
}
