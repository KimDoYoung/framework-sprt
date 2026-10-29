package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/mapper/act03_journal_dtl.xml — 분개 상세(S18: 급여 전표확인) */
@Mapper
public interface ActJournalDtlMapper {
    /** AS-IS selectPayMonth */
    List<JournalPayMonthRes> selectPayMonth(@Param("companyId") Long companyId, @Param("payDate") LocalDate payDate,
                                            @Param("payType") String payType);

    /** AS-IS selectByAstId — drCrType D(입금)·C(출금) */
    List<JournalDtlRes> selectByAstId(@Param("companyId") Long companyId, @Param("date") LocalDate date,
                                      @Param("astId") Long astId, @Param("drCrType") String drCrType);
}
