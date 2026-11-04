package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamDataInfo;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchInfoMapper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.icam.reader.IcamReader;
import kr.co.kfs.asseterp.biz.icam.reader.IcamRow;
import kr.co.kfs.asseterp.biz.icam.reader.IcamServer;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.infoData (L999) — ICAM 연계정보 정보코드(asseterp_gr)를 읽어 icam01_data_info에 넣거나 고친다.
 * (정보코드, 거래코드)가 이미 있으면 정보명·거래명만 ICAM 값으로 고치고 내부통제분류·비고는 기존 값을 유지한다.
 * 파라미터 없음, 한 트랜잭션, 실패 시 원인 문구만(AS-IS).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class InfoDataAction implements BatchAction {

    private static final String QUERY = "icam01_data_info.selectIcamInfoData";

    private final BatchInfoMapper infoMapper;
    private final IcamReader icamReader;

    @Override
    public String actionCode() {
        return "infoData";
    }

    @Override
    @Transactional
    public String run(BatchReq req) {
        log.info("ICAM 연계정보 정보코드 가져오기 시작 (infoData)");
        try {
            List<IcamRow> rows = icamReader.read(IcamServer.ICAM, QUERY, Map.of());
            for (IcamRow r : rows) {
                String infoCode = r.getString("icam01_info_cd");
                String trCode = r.getString("icam01_tr_cd");
                List<BatchIcamDataInfo> old = infoMapper.selectByInfoCodeAndTrCode(infoCode, trCode);
                Long icsClassTreeId = old.isEmpty() ? null : old.get(0).icsClassTreeId();
                String note = old.isEmpty() ? null : old.get(0).note();
                infoMapper.insertUpdate(new BatchIcamDataInfo(infoCode, r.getString("icam01_info_nm"),
                        trCode, r.getString("icam01_tr_nm"), icsClassTreeId, note));
            }
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "ICAM연계작업 정보코드 작업완료.. commit";
    }
}
