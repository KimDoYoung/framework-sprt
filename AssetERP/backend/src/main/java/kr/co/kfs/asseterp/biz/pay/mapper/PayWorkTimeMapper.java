package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay34_work_time_config.xml + UpdateDataModel(pay34_work_time_config) — 근로시간기준관리 */
@Mapper
public interface PayWorkTimeMapper {
    /** AS-IS selectByCompanyId (화면이 회사 0을 고정으로 넘김) */
    List<PayWorkTimeRes> selectByCompanyId(@Param("companyId") Long companyId);

    PayWorkTimeRes selectById(@Param("workTimeConfigId") Long workTimeConfigId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("workTimeConfigId") Long workTimeConfigId, @Param("companyId") Long companyId, @Param("req") PayWorkTimeSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayWorkTimeSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
