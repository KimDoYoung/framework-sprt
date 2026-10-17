package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.icam.dto.IcamSourceParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamSourceRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamSourceMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/** AS-IS server/icam/Icam50_Source.java (selectByServerTypePaging L22 = 목록 + 전체 건수, insertIcamDbSource L28) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamSourceService {

    private final IcamSourceMapper mapper;
    private final IcamBatchRunner batchRunner;

    /** 서버·구분은 비었거나 "전체"면 "%", 검색어는 "%text%" — 화면(Icam50_Tab_DbSource.retrieve L209-)이 하던 변환 */
    public PageRes<IcamSourceRes> search(LocalDate stdDate, String serverType, String sourceType, String nameSearchText,
                                         String sourceSearchText, int offset, int limit) {
        IcamSourceParam param = new IcamSourceParam(stdDate, all(serverType), all(sourceType),
                "%" + nullToEmpty(nameSearchText) + "%", "%" + nullToEmpty(sourceSearchText) + "%",
                Math.max(offset, 0), limit > 0 ? limit : 300);
        return new PageRes<>(mapper.selectByServerTypePagingTotal(param), mapper.selectByServerTypePaging(param));
    }

    /** AS-IS insertIcamDbSource: 오늘자 소스가 있으면 거절(하루 한 번), 없으면 외부 ICAM DB에서 가져온다(연동이 없으면 거절) */
    public void fetchSource(String worker) {
        if (mapper.countByStdDate() != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "당일자 작업이 완료되어 처리할 수 없습니다");
        }
        batchRunner.runSource(worker);
    }

    private static String all(String value) {
        return value == null || value.isEmpty() || "전체".equals(value) ? "%" : value;
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
