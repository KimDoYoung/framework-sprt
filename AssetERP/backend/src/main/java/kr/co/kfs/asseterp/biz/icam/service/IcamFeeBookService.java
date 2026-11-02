package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookCheckRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookDiffRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBookRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFeeBookMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/icam/Icam12_FeeBook.java (selectByStdDatePaging L20) · Icam13_FeeBookCheck.java (selectByStdDate L31, checkFeeBook L36-119).
 * 회사는 로그인 회사로 고정한다(원본도 LoginUser.getCompanyId()).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFeeBookService {

    private final IcamFeeBookMapper mapper;
    private final IcamBatchRunner batchRunner;

    public PageRes<IcamFeeBookRes> search(UserPrincipal user, LocalDate stdDate, String searchText, int offset, int limit) {
        IcamFeeBookParam param = new IcamFeeBookParam(user.getCompanyId(), stdDate, searchText == null ? "" : searchText,
                Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByStdDatePagingTotal(param), mapper.selectByStdDatePaging(param));
    }

    public List<IcamFeeBookCheckRes> searchChecks(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectCheckByStdDate(user.getCompanyId(), stdDate);
    }

    /**
     * AS-IS checkFeeBook — 기준일의 기존 잔액·대사 결과를 지우고, ICAM 말일 잔액을 읽어 넣은 뒤(외부 ICAM DB), AssetERP 보수원장과 대사해
     * 차이가 없으면 한 줄, 있으면 차이마다 한 줄을 남긴다. 외부 ICAM DB가 없으면 거절하며 같은 트랜잭션이라 지운 것도 되돌아간다.
     */
    @Transactional
    public void checkFeeBook(UserPrincipal user, LocalDate stdDate) {
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = user.getCompanyId();
        mapper.deleteFeeBook(companyId, stdDate);
        mapper.deleteCheck(companyId, stdDate);

        batchRunner.runLastDayFeeBook(companyId, stdDate, user.getName());

        List<IcamFeeBookDiffRes> diffs = mapper.selectFeeBookDiff(companyId, stdDate);
        if (diffs.isEmpty()) {
            mapper.insertCheck(companyId, stdDate, "펀드보수(ICAM vs AssetERP) 대사작업이 완료되었습니다. 차이금액이 없습니다.", 0.0, user.getUserId());
            return;
        }
        for (IcamFeeBookDiffRes d : diffs) {
            String result = d.corpName() + "(" + d.corpCode() + ") : " + d.fundCode() + " " + d.fundName() + " - "
                    + "ICAM " + d.icamFee() + " | " + "AssetERP " + d.forFee();
            mapper.insertCheck(companyId, stdDate, result, (double) (d.diffFee() == null ? 0L : d.diffFee()), user.getUserId());
        }
    }
}
