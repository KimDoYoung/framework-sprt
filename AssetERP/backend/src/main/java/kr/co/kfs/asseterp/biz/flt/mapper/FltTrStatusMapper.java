package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.TrStatusRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/flt/mapper/flt15_tr_status.xml */
@Mapper
public interface FltTrStatusMapper {

    /** AS-IS flt15_tr_status.selectByPersonId */
    TrStatusRes selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    /** AS-IS flt15_tr_status.insert (id는 f_create_seq) */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    /** AS-IS UpdateDataModel(flt15_tr_status) — note만. 수정: 로그인 회사의 행만 */
    int updateNote(@Param("companyId") Long companyId, @Param("trStatusId") Long trStatusId, @Param("note") String note);

    /** AS-IS flt15_tr_status.selectById */
    TrStatusRes selectById(@Param("companyId") Long companyId, @Param("trStatusId") Long trStatusId);
}
