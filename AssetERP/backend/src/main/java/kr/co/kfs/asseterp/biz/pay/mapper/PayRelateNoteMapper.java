package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay09_relate_note.xml + UpdateDataModel(pay09_relate_note) — 급여 비고(S16) */
@Mapper
public interface PayRelateNoteMapper {
    /** AS-IS selectByCompanyId / checkNote (같은 조건) */
    List<PayRelateNoteRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                                             @Param("payDate") LocalDate payDate, @Param("noteType") String noteType);

    PayRelateNoteRes selectById(@Param("companyId") Long companyId, @Param("relateNoteId") Long relateNoteId);

    Long selectNextId();

    int insert(@Param("relateNoteId") Long relateNoteId, @Param("companyId") Long companyId, @Param("req") PayRelateNoteSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayRelateNoteSaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
