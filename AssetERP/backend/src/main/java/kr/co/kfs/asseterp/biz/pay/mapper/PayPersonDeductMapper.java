package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PayPersonDeductMapper {

    /** pay25_person_deduct.selectByAll — 적용일별 첫 행(최신순) */
    List<PayStartDateRes> selectDates();

    /** pay25_person_deduct.selectByDate */
    List<PayPersonDeductRes> selectByDate(@Param("startDate") LocalDate startDate);

    /** pay25_person_deduct.selectByStartDate — 적용일 이전 가장 최근 적용일의 행 */
    List<PayPersonDeductRes> selectByStartDate(@Param("startDate") LocalDate startDate);

    PayPersonDeductRes selectById(@Param("id") Long id);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insert(@Param("id") Long id, @Param("req") PayPersonDeductSaveReq req);

    int update(@Param("req") PayPersonDeductSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** pay25_person_deduct.deleteByDate */
    int deleteByDate(@Param("startDate") LocalDate startDate);
}
