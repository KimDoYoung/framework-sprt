package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay20_item.xml + UpdateDataModel(pay20_item) — 급여항목 */
@Mapper
public interface PayItemMapper {
    /** AS-IS selectBySearchText (항목구분 LIKE, 항목명 LIKE) */
    List<PayItemRes> selectBySearchText(@Param("itemType") String itemType, @Param("searchText") String searchText);

    /** AS-IS selectByText (항목명 UPPER LIKE) */
    List<PayItemRes> selectByText(@Param("searchText") String searchText);

    /** AS-IS getMonthItem (S17 항목 List — 지급·공제 항목, 항목명 LIKE, 항목코드순) */
    List<PayItemRes> selectMonthItems(@Param("searchText") String searchText);

    /** AS-IS selectByItemType (급여 항목 행 추가 조회창 Pay20_Lookup_SelectMulti — 항목구분 정확히 일치, 항목코드순) */
    List<PayItemRes> selectByItemType(@Param("itemType") String itemType);

    PayItemRes selectById(@Param("itemId") Long itemId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("itemId") Long itemId, @Param("req") PayItemSaveReq req);

    int update(@Param("req") PayItemSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("ids") List<Long> ids);
}
