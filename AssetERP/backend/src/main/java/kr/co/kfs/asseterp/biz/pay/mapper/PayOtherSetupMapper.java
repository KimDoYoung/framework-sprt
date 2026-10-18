package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PayOtherSetupMapper {

    /** pay29_other_setup.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay29_other_setup.selectByDate */
    List<PayOtherSetupRes> selectByDate(@Param("startDate") LocalDate startDate);

    /** pay29_other_setup.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PayOtherSetupRes> selectByStartDate(@Param("startDate") LocalDate startDate);

    PayOtherSetupRes selectById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insert(@Param("id") Long id, @Param("row") PayOtherSetupSaveReq row);

    int update(@Param("req") PayOtherSetupSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** pay29_other_setup.deleteByDate */
    int deleteByDate(@Param("startDate") LocalDate startDate);
}
